import { apiRequest } from "./api";

export const PAYMENT_METHODS = [
    "Cash",
    "Bank Transfer",
    "Card",
    "POS",
    "Mobile Money",
    "Other",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type PaymentStatus = "Pending" | "Partially Paid" | "Paid";

export type InvoiceItem = {
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
};

export type Payment = {
    id: number;
    invoiceId: number;
    amount: number;
    method: PaymentMethod;
    reference: string | null;
    notes: string | null;
    paidAt: string;
    createdAt: string;
};

export type Invoice = {
    id: number;
    invoiceNumber: string;
    repairId: number;
    userId: number;
    labourCost: number;
    partsCost: number;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    amountPaid: number;
    balance: number;
    paymentMethod: PaymentMethod | null;
    paymentStatus: PaymentStatus;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    repair: {
        id: number;
        customer: string;
        customerPhone: string | null;
        customerEmail: string | null;
        device: string;
        deviceBrand: string | null;
        deviceModel: string | null;
        ticketNumber: string | null;
        status: string;
    };
    items: InvoiceItem[];
    payments: Payment[];
};

export type InvoiceItemPayload = {
    description: string;
    quantity: number;
    unitPrice: number;
};

export type InvoicePayload = {
    repairId: number;
    labourCost: number;
    discount: number;
    tax: number;
    amountPaid: number;
    paymentMethod?: PaymentMethod | "";
    paymentReference?: string;
    notes?: string;
    items: InvoiceItemPayload[];
};

export type PaymentPayload = {
    amount: number;
    method: PaymentMethod | "";
    reference?: string;
    paidAt?: string;
    notes?: string;
};

export async function getInvoices(): Promise<Invoice[]> {
    return apiRequest<Invoice[]>("/invoices");
}

export async function getInvoice(id: number): Promise<Invoice> {
    return apiRequest<Invoice>(`/invoices/${id}`);
}

export async function createInvoice(invoice: InvoicePayload): Promise<Invoice> {
    return apiRequest<Invoice>("/invoices", {
        method: "POST",
        body: JSON.stringify(invoice),
    });
}

export async function recordInvoicePayment(
    id: number,
    payment: PaymentPayload
): Promise<Invoice> {
    return apiRequest<Invoice>(`/invoices/${id}/payments`, {
        method: "POST",
        body: JSON.stringify(payment),
    });
}

export async function deleteInvoice(id: number): Promise<void> {
    await apiRequest(`/invoices/${id}`, {
        method: "DELETE",
    });
}
