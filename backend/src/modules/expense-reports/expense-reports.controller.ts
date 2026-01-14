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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExpenseReportsService } from './expense-reports.service';
import { CreateExpenseReportDto } from './dto/create-expense-report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense-report.dto';
import { ExpenseReportResponseDto } from './dto/expense-report-response.dto';

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
  @ApiOperation({ summary: 'Get all expense reports' })
  @ApiResponse({ status: 200, description: 'List of expense reports', type: [ExpenseReportResponseDto] })
  async findAll(): Promise<ExpenseReportResponseDto[]> {
    return this.reportsService.findAll();
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete expense report (soft delete)' })
  @ApiResponse({ status: 204, description: 'Expense report deleted' })
  @ApiResponse({ status: 404, description: 'Expense report not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.reportsService.remove(id);
  }
}
