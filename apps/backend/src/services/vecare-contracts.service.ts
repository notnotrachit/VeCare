import { HttpException } from '@/exceptions/HttpException';
import { veCareContract } from '@/utils/thor';
import { Service } from 'typedi';
import { unitsUtils } from '@vechain/sdk-core';

export interface Campaign {
  id: number;
  creator: string;
  title: string;
  description: string;
  medicalDocumentHash: string;
  goalAmount: string;
  raisedAmount: string;
  deadline: number;
  isActive: boolean;
  isVerified: boolean;
  fundsWithdrawn: boolean;
  createdAt: number;
  donorCount: number;
}

export interface CreatorProfile {
  totalCampaigns: number;
  successfulCampaigns: number;
  totalRaised: string;
  trustScore: number;
  lastUpdateTimestamp: number;
  exists: boolean;
}

@Service()
export class VeCareContractsService {
  /**
   * Create a new medical campaign
   */
  public async createCampaign(
    title: string,
    description: string,
    medicalDocumentHash: string,
    goalAmount: string,
    durationDays: number,
  ): Promise<{ success: boolean; campaignId?: number; txId?: string }> {
    try {
      const goalInWei = unitsUtils.parseUnits(goalAmount, 'ether');

      const result = await (await veCareContract.transact.createCampaign(title, description, medicalDocumentHash, goalInWei, durationDays)).wait();

      if (result.reverted) {
        return { success: false };
      }

      // Extract campaign ID from event topics
      // The CampaignCreated event has the campaign ID as the second topic (topics[1])
      let campaignId: number | undefined;

      if (result.outputs && result.outputs.length > 0) {
        const events = (result.outputs[0] as any).events;
        if (events && events.length > 0) {
          // Find the CampaignCreated event
          const campaignCreatedEvent = events.find((e: any) => e.topics && e.topics.length >= 2);

          if (campaignCreatedEvent && campaignCreatedEvent.topics) {
            // Campaign ID is in topics[1] as a hex string
            const campaignIdHex = campaignCreatedEvent.topics[1];
            campaignId = parseInt(campaignIdHex, 16);
          }
        }
      }

      const txId = (result.meta as any)?.txID || undefined;

      console.log('Campaign created successfully. Campaign ID:', campaignId, 'TX:', txId);

      return {
        success: true,
        campaignId,
        txId,
      };
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw new HttpException(500, 'Failed to create campaign on blockchain');
    }
  }

  /**
   * Verify a campaign (admin only)
   */
  public async verifyCampaign(campaignId: number, verified: boolean): Promise<boolean> {
    try {
      const result = await (await veCareContract.transact.verifyCampaign(campaignId, verified)).wait();

      return !result.reverted;
    } catch (error) {
      console.error('Error verifying campaign:', error);
      return false;
    }
  }

  /**
   * Get campaign details
   */
  public async getCampaign(campaignId: number): Promise<Campaign | null> {
    try {
      const result = await veCareContract.read.getCampaign(campaignId);

      if (!result || result.length === 0) {
        return null;
      }

      const campaignData = result[0];

      return {
        id: Number(campaignData.id),
        creator: campaignData.creator,
        title: campaignData.title,
        description: campaignData.description,
        medicalDocumentHash: campaignData.medicalDocumentHash,
        goalAmount: unitsUtils.formatUnits(campaignData.goalAmount, 'ether'),
        raisedAmount: unitsUtils.formatUnits(campaignData.raisedAmount, 'ether'),
        deadline: Number(campaignData.deadline),
        isActive: campaignData.isActive,
        isVerified: campaignData.isVerified,
        fundsWithdrawn: campaignData.fundsWithdrawn,
        createdAt: Number(campaignData.createdAt),
        donorCount: Number(campaignData.donorCount),
      };
    } catch (error) {
      console.error('Error getting campaign:', error);
      return null;
    }
  }

  /**
   * Get all campaigns (paginated)
   */
  public async getAllCampaigns(startId = 1, limit = 20): Promise<Campaign[]> {
    try {
      const campaignCountResult = await veCareContract.read.campaignCounter();
      const totalCampaigns = Number(campaignCountResult[0]);

      const campaigns: Campaign[] = [];
      const endId = Math.min(startId + limit - 1, totalCampaigns);

      for (let i = startId; i <= endId; i++) {
        const campaign = await this.getCampaign(i);
        if (campaign) {
          campaigns.push(campaign);
        }
      }

      return campaigns;
    } catch (error) {
      console.error('Error getting all campaigns:', error);
      return [];
    }
  }

  /**
   * Get active verified campaigns
   */
  public async getActiveVerifiedCampaigns(): Promise<Campaign[]> {
    try {
      const allCampaigns = await this.getAllCampaigns(1, 100); // Adjust limit as needed
      const now = Math.floor(Date.now() / 1000);

      return allCampaigns.filter(campaign => campaign.isActive && campaign.isVerified && campaign.deadline > now);
    } catch (error) {
      console.error('Error getting active verified campaigns:', error);
      return [];
    }
  }

  /**
   * Get creator profile
   */
  public async getCreatorProfile(creatorAddress: string): Promise<CreatorProfile | null> {
    try {
      const result = await veCareContract.read.getCreatorProfile(creatorAddress);

      if (!result || result.length === 0) {
        return null;
      }

      const profileData = result[0];

      return {
        totalCampaigns: Number(profileData.totalCampaigns),
        successfulCampaigns: Number(profileData.successfulCampaigns),
        totalRaised: unitsUtils.formatUnits(profileData.totalRaised, 'ether'),
        trustScore: Number(profileData.trustScore),
        lastUpdateTimestamp: Number(profileData.lastUpdateTimestamp),
        exists: profileData.exists,
      };
    } catch (error) {
      console.error('Error getting creator profile:', error);
      return null;
    }
  }

  /**
   * Get donation amount for a specific donor
   */
  public async getDonation(campaignId: number, donorAddress: string): Promise<string> {
    try {
      const result = await veCareContract.read.getDonation(campaignId, donorAddress);
      return unitsUtils.formatUnits(result[0], 'ether');
    } catch (error) {
      console.error('Error getting donation:', error);
      return '0';
    }
  }

  /**
   * Check if campaign goal is reached
   */
  public async isGoalReached(campaignId: number): Promise<boolean> {
    try {
      const result = await veCareContract.read.isGoalReached(campaignId);
      return Boolean(result[0]);
    } catch (error) {
      console.error('Error checking goal status:', error);
      return false;
    }
  }

  /**
   * Get campaign update count
   */
  public async getCampaignUpdateCount(campaignId: number): Promise<number> {
    try {
      const result = await veCareContract.read.getCampaignUpdateCount(campaignId);
      return Number(result[0]);
    } catch (error) {
      console.error('Error getting update count:', error);
      return 0;
    }
  }

  /**
   * Validate campaign creation parameters
   */
  public validateCampaignParams(title: string, description: string, goalAmount: string, durationDays: number): void {
    if (!title || title.trim().length === 0) {
      throw new HttpException(400, 'Campaign title is required');
    }

    if (!description || description.trim().length < 50) {
      throw new HttpException(400, 'Campaign description must be at least 50 characters');
    }

    const goal = parseFloat(goalAmount);
    if (isNaN(goal) || goal <= 0) {
      throw new HttpException(400, 'Invalid goal amount');
    }

    if (durationDays < 1 || durationDays > 365) {
      throw new HttpException(400, 'Campaign duration must be between 1 and 365 days');
    }
  }
}
