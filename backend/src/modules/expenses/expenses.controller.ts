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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto, ExpenseResponseDto } from './dto/expense.dto';

/**
 * Controller for expense management
 */
@ApiTags('expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created', type: ExpenseResponseDto })
  async create(@Body() createDto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    return this.expensesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiQuery({ name: 'reportId', required: false })
  @ApiResponse({ status: 200, description: 'List of expenses', type: [ExpenseResponseDto] })
  async findAll(@Query('reportId') reportId?: string): Promise<ExpenseResponseDto[]> {
    if (reportId) {
      return this.expensesService.findByReport(reportId);
    }
    return this.expensesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense found', type: ExpenseResponseDto })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async findOne(@Param('id') id: string): Promise<ExpenseResponseDto> {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update expense' })
  @ApiResponse({ status: 200, description: 'Expense updated', type: ExpenseResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    return this.expensesService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete expense' })
  @ApiResponse({ status: 204, description: 'Expense deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.expensesService.remove(id);
  }
}
