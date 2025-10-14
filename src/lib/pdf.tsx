import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { TransactionWithCategory } from './csv';
import { formatCurrency, formatDate } from './utils';

// Register fonts if needed
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    borderBottom: '1 solid #E5E7EB',
    paddingBottom: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
  },
  tableHeader: {
    backgroundColor: '#F9FAFB',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    borderRightStyle: 'solid',
  },
  tableCellLast: {
    padding: 8,
    fontSize: 10,
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  summaryValue: {
    fontSize: 12,
    color: '#374151',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#6B7280',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: '#6B7280',
  },
});

interface PDFReportProps {
  transactions: TransactionWithCategory[];
  user: {
    name: string;
    email: string;
  };
  dateRange: {
    from: Date;
    to: Date;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    transactionCount: number;
  };
}

export const TransactionReportPDF: React.FC<PDFReportProps> = ({
  transactions,
  user,
  dateRange,
  summary,
}) => {
  const formatAmount = (amount: number, type: string) => {
    const formatted = formatCurrency(amount, 'EUR', 'es-ES');
    return type === 'EXPENSE' ? `-${formatted}` : formatted;
  };

  const getTypeLabel = (type: string) => {
    return type === 'INCOME' ? 'Ingreso' : 'Gasto';
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      CARD: 'Tarjeta',
      CASH: 'Efectivo',
      TRANSFER: 'Transferencia',
      OTHER: 'Otro',
    };
    return labels[method] || method;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reporte de Transacciones</Text>
          <Text style={styles.subtitle}>
            {user.name} - {formatDate(dateRange.from)} a {formatDate(dateRange.to)}
          </Text>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Ingresos:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(summary.totalIncome, 'EUR', 'es-ES')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Gastos:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(summary.totalExpenses, 'EUR', 'es-ES')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Balance:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(summary.balance, 'EUR', 'es-ES')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Transacciones:</Text>
              <Text style={styles.summaryValue}>{summary.transactionCount}</Text>
            </View>
          </View>
        </View>

        {/* Transactions Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transacciones</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '15%' }]}>Fecha</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>Tipo</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Categoría</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Monto</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>Descripción</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>Método</Text>
            </View>

            {/* Table Rows */}
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '15%' }]}>
                  {formatDate(transaction.date, 'es-ES', { day: '2-digit', month: '2-digit' })}
                </Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>
                  {getTypeLabel(transaction.type)}
                </Text>
                <Text style={[styles.tableCell, { width: '20%' }]}>
                  {transaction.category.name}
                </Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>
                  {formatAmount(Number(transaction.amount), transaction.type)}
                </Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>
                  {transaction.description || '-'}
                </Text>
                <Text style={[styles.tableCellLast, { width: '15%' }]}>
                  {getPaymentMethodLabel(transaction.paymentMethod)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generado el {formatDate(new Date(), 'es-ES')} - Finance Dash Pro
        </Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => 
          `${pageNumber} / ${totalPages}`
        } />
      </Page>
    </Document>
  );
};

export default TransactionReportPDF;

