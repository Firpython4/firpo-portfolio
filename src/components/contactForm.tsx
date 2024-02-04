"use client"

import {
    type FieldErrors, type FieldPath,
    type FieldValues, type RegisterOptions,
    useForm,
    type UseFormRegister,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { submitLink } from "~/config";
import { type Locale } from "~/localization/localization";
import type PropsWithClassName from "../types/propsWithClassName";
import {type ContactFormErrors, type LocalizedCopy} from "~/localization/copy";

const ContactFormValues = (errors: ContactFormErrors) =>
{
    return z.object({
        "First Name": z.string().min(1, errors.thisFieldIsMandatory).max(100, errors.thisFieldIsTooLong),
        "Last Name": z.string().min(1, errors.thisFieldIsMandatory).max(200, errors.thisFieldIsTooLong),
        "Email": z.string().min(1, errors.thisFieldIsMandatory).email(errors.invalidEmail),
        "Subject": z.string().min(1, errors.thisFieldIsMandatory).max(3000, errors.thisFieldIsTooLong),
        "Content": z.string().min(1, errors.thisFieldIsMandatory).max(6000, errors.thisFieldIsTooLong)
    });
}

export type ContactFormType = z.infer<ReturnType<typeof ContactFormValues>>;

const formBorderClassNames = "border-2 border-gray-300 rounded-md";
const formClassNames = `h-8 px-2 py-4 ${formBorderClassNames}`;

function FormItem<FieldValuesType extends FieldValues, FieldNameType extends FieldPath<FieldValuesType>>(props: PropsWithClassName<{ placeholder: string, register: UseFormRegister<FieldValuesType>, name: FieldNameType, options?: RegisterOptions, errors: FieldErrors<FieldValuesType>}>)
{
    const errorMessages = props.errors[props.name]?.message;
    if (typeof errorMessages == "string")
    {
        return (
            <div className={`flex flex-col ${props.className}`}>
                {<p className="text-red-500">{errorMessages}</p>}
                <input className={`${formClassNames}`}
                       type="text"
                       placeholder={props.placeholder} {...props.register(props.name, props.options)}/>
            </div>
        );
    }
    else
    {
        return (
            <>
                <input className={`${props.className} ${formClassNames}`}
                       type="text"
                       placeholder={props.placeholder} {...props.register(props.name, props.options)}/>
            </>
        );
    }
}

function FormArea<FieldValuesType extends FieldValues, FieldNameType extends FieldPath<FieldValuesType>>(props: PropsWithClassName<{ placeholder: string, register: UseFormRegister<FieldValuesType>, name: FieldNameType, options?: RegisterOptions, errors: FieldErrors<FieldValuesType>}>)
{
    const errorMessages = props.errors[props.name]?.message;
    if (typeof errorMessages == "string")
    {
        return (
            <div className={`flex flex-col`}>
                {<p className="text-red-500">{errorMessages}</p>}
                <textarea className={`${formBorderClassNames} ${props.className}`}
                       placeholder={props.placeholder} {...props.register(props.name, props.options)}/>
            </div>
        );
    }
    else
    {
        return (
            <>
                <textarea className={`${props.className} ${formBorderClassNames}`}
                       placeholder={props.placeholder} {...props.register(props.name, props.options)}/>
            </>
        );
    }
}


const ContactForm = (props: PropsWithClassName<{locale: Locale, copy: LocalizedCopy}>) =>
{
    const formProps = {
        resolver: zodResolver(ContactFormValues(props.copy.home.contactForm.errors))
    };

    const { register, handleSubmit, formState: { errors } } = useForm<ContactFormType>(formProps);
    console.log(errors);
    const contactForm = props.copy.home.contactForm;
    return <form className={`${props.className} font-inter flex flex-col gap-y-8 items-center relative`}
                                                                 onSubmit={handleSubmit(async (data) =>
                                        {
                                            try
                                            {
                                                await fetch(submitLink(data));
                                            }
                                            catch (error)
                                            {
                                                //Okay to catch the error here. Google Forms won't return a well-formed response.
                                            }
                                        })}>
        <div className="grid grid-cols-2 grid-rows-6 gap-x-3 gap-y-4">
            <FormItem placeholder={contactForm.firstName} name="First Name" register={register} options={{required: true}} errors={errors}/>
            <FormItem placeholder={contactForm.lastName} name="Last Name" register={register} options={{required: true}} errors={errors}/>
            <FormItem className="col-span-2" placeholder={contactForm.email} name="Email" register={register} options={{required: true}} errors={errors}/>
            <FormItem className="col-span-2" placeholder={contactForm.subject} name={"Subject"} register={register} errors={errors}/>
            <FormArea className={`col-span-2 row-span-4 px-2 py-1 resize-none`} placeholder={contactForm.content} name="Content" register={register} options={{required: true}} errors={errors}/>
        </div>
        <input className="border-2 border-gray-300 rounded-md w-[20%] cursor-pointer" type="submit" value="Send"
               lang={props.locale}/>
    </form>
}

export default ContactForm;