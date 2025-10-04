import { HttpException } from '@/exceptions/HttpException';
import { openAIHelper } from '@/server';
import { isBase64Image } from '@/utils/data';
import { Service } from 'typedi';

export interface MedicalVerificationResult {
  isVerified: boolean;
  confidenceScore: number; // 0-1
  documentType: string;
  findings: string[];
  reasoning: string;
  redFlags: string[];
}

@Service()
export class MedicalVerificationService {
  /**
   * Verify medical documents using AI
   * Analyzes authenticity, legitimacy, and medical validity
   */
  public async verifyMedicalDocuments(images: string[]): Promise<MedicalVerificationResult> {
    if (!images || images.length === 0) {
      throw new HttpException(400, 'No medical documents provided');
    }

    // Validate all images are in correct format
    for (const image of images) {
      if (!isBase64Image(image)) {
        throw new HttpException(400, 'Invalid image format detected');
      }
    }

    const prompt = `
You are an AI medical document verification system for VeCare Chain, a medical crowdfunding platform.

Analyze the provided medical document(s) carefully. Your task is to verify authenticity and legitimacy.

VERIFICATION CRITERIA:
1. **Document Authenticity**: 
   - Is this a genuine medical document (doctor's letter, hospital bill, prescription, diagnosis report, etc.)?
   - Does it contain proper medical letterhead, stamps, or official markings?
   - Are there visible signs of tampering or manipulation?

2. **Medical Legitimacy**:
   - Does it contain legitimate medical information (diagnosis, treatment plan, cost estimates)?
   - Are medical terms used correctly and appropriately?
   - Does the document appear professionally formatted?

3. **Credibility Indicators**:
   - Doctor/Hospital name and credentials visible?
   - Date of issue present?
   - Patient information (can be redacted for privacy)?
   - Medical facility contact information?

4. **Red Flags** (if any):
   - Screenshot or photo of a screen (not original document)
   - Poor quality or heavily edited
   - Inconsistent information
   - Missing critical elements
   - Suspicious formatting or language

RESPONSE FORMAT:
Respond ONLY with a valid JSON object (no markdown, no code blocks):
{
  "isVerified": boolean, // true if document passes verification, false otherwise
  "confidenceScore": number, // 0.0 to 1.0, your confidence in the verification
  "documentType": string, // e.g., "Doctor's Letter", "Hospital Bill", "Prescription", "Diagnosis Report"
  "findings": [string], // list of positive findings that support authenticity
  "reasoning": string, // brief explanation of your decision (2-3 sentences, user-friendly)
  "redFlags": [string] // list of concerns or red flags (empty array if none)
}

IMPORTANT:
- Be thorough but not overly strict
- Consider that documents may be scanned or photographed
- Focus on genuine medical need verification, not perfect document quality
- A confidenceScore above 0.7 with no major red flags should result in isVerified: true
- Provide clear, empathetic reasoning that respects the sensitive nature of medical situations
`;

    try {
      // For multiple images, analyze the first one (can be extended to analyze all)
      const primaryImage = images[0];
      
      const gptResponse = await openAIHelper.askChatGPTAboutImage({
        base64Image: primaryImage,
        prompt,
      });

      const responseJSONStr = openAIHelper.getResponseJSONString(gptResponse);
      const result = openAIHelper.parseChatGPTJSONString(responseJSONStr) as MedicalVerificationResult;

      // Validate response structure
      if (!result || typeof result.isVerified !== 'boolean' || typeof result.confidenceScore !== 'number') {
        throw new HttpException(500, 'Invalid AI verification response');
      }

      return result;
    } catch (error) {
      console.error('Medical verification error:', error);
      throw new HttpException(500, 'Error during medical document verification');
    }
  }

  /**
   * Quick validation for document format and basic requirements
   */
  public async quickValidate(image: string): Promise<{ valid: boolean; message: string }> {
    if (!isBase64Image(image)) {
      return { valid: false, message: 'Invalid image format' };
    }

    // Additional quick checks can be added here
    return { valid: true, message: 'Document format valid' };
  }
}
