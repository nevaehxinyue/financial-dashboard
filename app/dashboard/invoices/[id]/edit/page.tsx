import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";

interface Props {
    params: {id: string};
}

export default async function Page ({params}: Props) {
    const id = params.id;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers()
    ])
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