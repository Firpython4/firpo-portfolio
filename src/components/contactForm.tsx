"use client"

import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { submitLink } from "../config";
import { type Locale } from "../localization/localization";
import type PropsWithClassName from "../types/propsWithClassName";

const ContactFormValues = z.object({
    "First Name": z.string().min(1).max(100),
    "Last Name": z.string().min(1).max(200),
    "Email": z.string().email(),
    "Subject": z.string().min(1).max(3000),
    "Content": z.string().min(1).max(6000)
})

export type ContactFormType = z.infer<typeof ContactFormValues>;

const formBorderClassNames = "border-2 border-gray-300 rounded-md";
const formClassNames = `h-8 px-2 py-4 ${formBorderClassNames}`;

const FormItem = (props: PropsWithClassName<{ placeholder: string, register: UseFormRegisterReturn<string> }>) =>
{
    return (<input
        className={`${props.className} ${formClassNames}`} type="text"
        placeholder={props.placeholder} {...props.register}/>
    );
};

const ContactForm = (props: PropsWithClassName<{locale: Locale}>) =>
{
    const formProps = {
        resolver: zodResolver(ContactFormValues)
    };

    const { register, handleSubmit, formState: { errors } } = useForm<ContactFormType>(formProps);
    console.log(errors);
    return <form className={`${props.className} font-inter flex flex-col gap-y-8 items-center relative`}
                 onSubmit={handleSubmit(async (data) =>
                                        {
                                            try
                                            {
                                                await fetch(submitLink(data));
                                            }
                                            catch (error)
                                            {
                                            }
                                        })}>
        <div className="grid grid-cols-2 grid-rows-6 gap-x-3 gap-y-4">
            <FormItem placeholder="First name" register={register("First Name", {required: true})}/>
            <FormItem placeholder="Last name" register={register("Last Name", {required: true})}/>
            <FormItem className="col-span-2" placeholder="Email" register={register("Email", {required: true})}/>
            <FormItem className="col-span-2" placeholder="Subject" register={register("Subject", {required: true})}/>
            <textarea className={`col-span-2 row-span-4 px-2 py-1 ${formBorderClassNames} resize-none`}
                      placeholder="Content" {...register("Content", {required: true})} />
        </div>
        <input className="border-2 border-gray-300 rounded-md w-[20%] cursor-pointer" type="submit" value="Send"
               lang={props.locale}/>
    </form>
}

export default ContactForm;