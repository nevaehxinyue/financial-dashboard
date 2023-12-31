import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
    params: {id: string};
}

export default async function Page ({params}: Props) {
    const id = params.id;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers()
    ])

    if(!invoice) {
        notFound();
    }
    return (
        <main> 
            <Breadcrumbs breadcrumbs={[
                 {label: 'Invoices', href: '/dashboard/invoices', active: true},
                 {
                     label: 'Edit Invoice',
                     href: `/dashboard/invoices/${id}/edit`,
                     active: true,
                 }

            ]}/>
            <EditInvoiceForm invoice={invoice} customers={customers}/>

        </main>

    );
}

export const metadata: Metadata = {
    title: 'Edit Invoice',
  }