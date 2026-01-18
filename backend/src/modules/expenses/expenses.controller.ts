import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { ExpensesService } from './expenses.service';
import { AttachmentsService } from './attachments.service';
import { CreateExpenseDto, UpdateExpenseDto, ExpenseResponseDto } from './dto/expense.dto';

/**
 * Controller for expense management with file attachments
 */
@ApiTags('expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  /**
   * Create expense with optional file attachment
   * File and data sent as multipart/form-data
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create a new expense with optional file attachment' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reportId: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        amount: { type: 'number' },
        expenseDate: { type: 'string', format: 'date' },
        category: { type: 'string', enum: ['TRAVEL', 'MEAL', 'HOTEL', 'TRANSPORT', 'OFFICE_SUPPLIES', 'OTHER'] },
        file: { type: 'string', format: 'binary' },
      },
      required: ['reportId', 'name', 'amount', 'expenseDate', 'category'],
    },
  })
  @ApiResponse({ status: 201, description: 'Expense created with attachment metadata', type: ExpenseResponseDto })
  async create(
    @Body() createDto: CreateExpenseDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ExpenseResponseDto> {
    return this.expensesService.createWithAttachment(createDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses with attachment metadata (no BLOB)' })
  @ApiQuery({ name: 'reportId', required: false })
  @ApiResponse({ status: 200, description: 'List of expenses with attachments metadata', type: [ExpenseResponseDto] })
  async findAll(@Query('reportId') reportId?: string): Promise<ExpenseResponseDto[]> {
    if (reportId) {
      return this.expensesService.findByReport(reportId);
    }
    return this.expensesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID with attachment metadata (no BLOB)' })
  @ApiResponse({ status: 200, description: 'Expense found with attachments metadata', type: ExpenseResponseDto })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async findOne(@Param('id') id: string): Promise<ExpenseResponseDto> {
    return this.expensesService.findOne(id);
  }

  /**
   * Update expense with optional new file attachment
   * File and data sent as multipart/form-data
   */
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update expense with optional new file attachment' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reportId: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        amount: { type: 'number' },
        expenseDate: { type: 'string', format: 'date' },
        category: { type: 'string', enum: ['TRAVEL', 'MEAL', 'HOTEL', 'TRANSPORT', 'OFFICE_SUPPLIES', 'OTHER'] },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Expense updated with attachment metadata', type: ExpenseResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateExpenseDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ExpenseResponseDto> {
    return this.expensesService.updateWithAttachment(id, updateDto, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete expense' })
  @ApiResponse({ status: 204, description: 'Expense deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.expensesService.remove(id);
  }

  /**
   * Download attachment - EXPLICIT BLOB LOADING
   * This is the ONLY endpoint that loads the BLOB
   */
  @Get('attachments/:attachmentId/download')
  @ApiOperation({ summary: 'Download attachment file - Explicit BLOB loading' })
  @ApiResponse({ status: 200, description: 'File downloaded' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async downloadAttachment(
    @Param('attachmentId') attachmentId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { fileName, mimeType, fileData } = await this.attachmentsService.downloadAttachment(attachmentId);
    
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    
    return new StreamableFile(fileData);
  }

  /**
   * Delete an attachment
   */
  @Delete('attachments/:attachmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an attachment' })
  @ApiResponse({ status: 204, description: 'Attachment deleted' })
  async deleteAttachment(@Param('attachmentId') attachmentId: string): Promise<void> {
    return this.attachmentsService.remove(attachmentId);
  }
}
