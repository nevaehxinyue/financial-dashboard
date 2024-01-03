'use server'
// 'zod' is a TypeScript-first validation library for handling data type validation
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';



//Valudate formData before saving it to database
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    // To coerce from a string to a number while also validating its types
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string()
})

const CreateInvoice =  FormSchema.omit({id: true, date: true});

const UpdateInvoice = FormSchema.omit({id: true, date: true});

export async function createInvoice(formData: FormData) {
    // const rawFormData = Object.fromEntries(formData.entries())
    const { customerId, amount, status } = CreateInvoice.parse ({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    });
    //It's usually good practice to store monetary values in database to 
    //eliminate JavaScript floating-point errors and ensure greater accuracy.
    const amountInCents = amount * 100;
    //.toISOString(): This method converts the Date object to a string using the ISO 8601 format. 
    //The resulting string has the format YYYY-MM-DDTHH:mm:ss.sssZ. 
    //.split('T')[0]: This method splits the ISO string into an array using 'T' as the delimiter, 
    //separating the date and the time parts. The split method returns an array, 
    //and [0] accesses the first element of that array, which is the date part of the ISO string (YYYY-MM-DD).
    const date = new Date().toISOString().split('T')[0];

    await sql `
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date} )
    `;
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    })

    const amountInCents = amount * 100;

    const date = new Date().toISOString().split('T')[0];

    await sql `
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, date = ${date}
        WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    await sql `
        DELETE FROM invoices WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
}