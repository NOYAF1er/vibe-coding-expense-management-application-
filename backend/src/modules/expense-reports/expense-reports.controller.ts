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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ExpenseReportsService } from './expense-reports.service';
import { CreateExpenseReportDto } from './dto/create-expense-report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense-report.dto';
import { ExpenseReportResponseDto } from './dto/expense-report-response.dto';
import { QueryExpenseReportsDto, SortBy, SortOrder } from './dto/query-expense-reports.dto';
import { PaginatedExpenseReportsDto } from './dto/paginated-expense-reports.dto';
import { ExpenseReportStatus } from '../../common/enums/expense-report-status.enum';

/**
 * Controller for expense report management
 */
@ApiTags('expense-reports')
@Controller('expense-reports')
export class ExpenseReportsController {
  constructor(private readonly reportsService: ExpenseReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense report' })
  @ApiResponse({ status: 201, description: 'Expense report created', type: ExpenseReportResponseDto })
  async create(@Body() createDto: CreateExpenseReportDto): Promise<ExpenseReportResponseDto> {
    return this.reportsService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get expense reports with pagination, search, filters, and sorting',
    description: 'Retrieve a paginated list of expense reports with optional search, status filter, amount range filter, and sorting capabilities'
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of expense reports',
    type: PaginatedExpenseReportsDto
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)', example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for title field', example: 'Client' })
  @ApiQuery({ name: 'status', required: false, enum: ExpenseReportStatus, description: 'Filter by status', example: ExpenseReportStatus.SUBMITTED })
  @ApiQuery({ name: 'minAmount', required: false, type: Number, description: 'Minimum amount filter', example: 50 })
  @ApiQuery({ name: 'maxAmount', required: false, type: Number, description: 'Maximum amount filter', example: 500 })
  @ApiQuery({ name: 'sortBy', required: false, enum: SortBy, description: 'Field to sort by (default: reportDate)', example: SortBy.TOTAL_AMOUNT })
  @ApiQuery({ name: 'order', required: false, enum: SortOrder, description: 'Sort order (default: desc)', example: SortOrder.ASC })
  async findAll(@Query() queryDto: QueryExpenseReportsDto): Promise<PaginatedExpenseReportsDto> {
    return this.reportsService.findAllPaginated(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense report by ID' })
  @ApiResponse({ status: 200, description: 'Expense report found', type: ExpenseReportResponseDto })
  @ApiResponse({ status: 404, description: 'Expense report not found' })
  async findOne(@Param('id') id: string): Promise<ExpenseReportResponseDto> {
    return this.reportsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all reports for a user' })
  @ApiResponse({ status: 200, description: 'List of user expense reports', type: [ExpenseReportResponseDto] })
  async findByUser(@Param('userId') userId: string): Promise<ExpenseReportResponseDto[]> {
    return this.reportsService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update expense report' })
  @ApiResponse({ status: 200, description: 'Expense report updated', type: ExpenseReportResponseDto })
  @ApiResponse({ status: 404, description: 'Expense report not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateExpenseReportDto,
  ): Promise<ExpenseReportResponseDto> {
    return this.reportsService.update(id, updateDto);
  }

  @Post(':id/calculate-total')
  @ApiOperation({ summary: 'Recalculate report total from expenses' })
  @ApiResponse({ status: 200, description: 'Total amount calculated' })
  async calculateTotal(@Param('id') id: string): Promise<{ total: number }> {
    const total = await this.reportsService.calculateTotal(id);
    return { total };
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit expense report (change status from DRAFT to SUBMITTED)' })
  @ApiResponse({ status: 200, description: 'Expense report submitted', type: ExpenseReportResponseDto })
  @ApiResponse({ status: 404, description: 'Expense report not found' })
  @ApiResponse({ status: 400, description: 'Report cannot be submitted (not in DRAFT status)' })
  async submit(@Param('id') id: string): Promise<ExpenseReportResponseDto> {
    return this.reportsService.submit(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete expense report (soft delete)' })
  @ApiResponse({ status: 204, description: 'Expense report deleted' })
  @ApiResponse({ status: 404, description: 'Expense report not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.reportsService.remove(id);
  }
}
