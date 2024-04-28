"use client"

import {
    FieldError,
    FieldErrors, FieldPath,
    FieldValues, RegisterOptions,
    useForm,
    UseFormRegister,
    type UseFormRegisterReturn
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { submitLink } from "~/config";
import { type Locale } from "~/localization/localization";
import type PropsWithClassName from "../types/propsWithClassName";
import {ContactFormErrors, LocalizedCopy} from "~/localization/copy";

const ContactFormValues = (errors: ContactFormErrors) =>
{
    const requiredError = {required_error: errors.thisFieldIsMandatory};
    return z.object({
        "First Name": z.string(requiredError).min(1).max(100, errors.thisFieldIsTooLong),
        "Last Name": z.string(requiredError).min(1).max(200, errors.thisFieldIsTooLong),
        "Email": z.string(requiredError).email(errors.invalidEmail),
        "Subject": z.string(requiredError).min(1).max(3000, errors.thisFieldIsTooLong),
        "Content": z.string(requiredError).min(1).max(6000, errors.thisFieldIsTooLong)
    });
}

export type ContactFormType = z.infer<ReturnType<typeof ContactFormValues>>;

const formBorderClassNames = "border-2 border-gray-300 rounded-md";
const formClassNames = `h-8 px-2 py-4 ${formBorderClassNames}`;

function FormItem<FieldValuesType extends FieldValues, FieldNameType extends FieldPath<FieldValuesType>>(props: PropsWithClassName<{ placeholder: string, register: UseFormRegister<FieldValuesType>, name: FieldNameType, options?: RegisterOptions, errors: FieldErrors<FieldValuesType>}>)
{
    const message = props.errors[props.name]?.message;
    if (typeof message === "string")
    {
        return (
            <>
                <p>{message}</p>
                <input className={`${props.className} ${formClassNames}`}
                       type="text"
                       placeholder={props.placeholder} {...props.register(props.name, props.options)}/>
            </>
        );
    }
};

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
                                            }
                                        })}>
        <div className="grid grid-cols-2 grid-rows-6 gap-x-3 gap-y-4">
            <FormItem placeholder={contactForm.firstName} name="First Name" register={register} options={{required: true}} errors={errors}/>
            <FormItem placeholder={contactForm.lastName} name="Last Name" register={register} options={{required: true}}/>
            <FormItem className="col-span-2" placeholder={contactForm.email} name="Email" register={register} options={{required: true}}/>
            <FormItem className="col-span-2" placeholder={contactForm.subject} name={"Subject"} register={register("Subject", {required: true})}/>
            <textarea className={`col-span-2 row-span-4 px-2 py-1 ${formBorderClassNames} resize-none`}
                      placeholder={contactForm.content} {...register("Content", {required: true})} />
        </div>
        <input className="border-2 border-gray-300 rounded-md w-[20%] cursor-pointer" type="submit" value="Send"
               lang={props.locale}/>
    </form>
}

export default ContactForm;