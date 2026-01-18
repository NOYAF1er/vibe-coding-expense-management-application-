import { 
  Injectable, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from '../../common/constants/file-upload.constants';

/**
 * Service for managing file attachments with BLOB storage
 */
@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  /**
   * Validate file before upload
   */
  private validateFile(file: Express.Multer.File): void {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      );
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
      );
    }
  }

  /**
   * Upload a file attachment for an expense
   * Stores the file as BLOB in database with metadata
   */
  async uploadAttachment(
    expenseId: string,
    file: Express.Multer.File,
  ): Promise<Omit<Attachment, 'fileData'>> {
    // Validate file
    this.validateFile(file);

    // Create attachment entity
    const attachment = this.attachmentRepository.create({
      expenseId,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      uploadedAt: new Date(),
      fileData: file.buffer, // Store BLOB
    });

    // Save to database
    const saved = await this.attachmentRepository.save(attachment);

    // Return without BLOB data (lazy loading)
    const { fileData, ...metadata } = saved;
    return metadata;
  }

  /**
   * Get attachment metadata by ID (without BLOB)
   */
  async findOne(id: string): Promise<Omit<Attachment, 'fileData'>> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    // Return without BLOB
    const { fileData, ...metadata } = attachment;
    return metadata;
  }

  /**
   * Get all attachments for an expense (without BLOBs)
   */
  async findByExpense(expenseId: string): Promise<Omit<Attachment, 'fileData'>[]> {
    const attachments = await this.attachmentRepository.find({
      where: { expenseId },
    });

    // Return without BLOBs
    return attachments.map(({ fileData, ...metadata }) => metadata);
  }

  /**
   * Download attachment - EXPLICIT BLOB LOADING
   * This is the ONLY method that loads the BLOB
   */
  async downloadAttachment(id: string): Promise<{
    fileName: string;
    mimeType: string;
    fileData: Buffer;
  }> {
    // Explicitly load BLOB using QueryBuilder with addSelect
    const attachment = await this.attachmentRepository
      .createQueryBuilder('attachment')
      .where('attachment.id = :id', { id })
      .addSelect('attachment.fileData') // Explicitly load BLOB
      .getOne();

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    return {
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      fileData: attachment.fileData,
    };
  }

  /**
   * Delete an attachment
   */
  async remove(id: string): Promise<void> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    await this.attachmentRepository.remove(attachment);
  }
}
