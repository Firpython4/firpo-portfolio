"use client";

import {
  type FieldErrors,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  type UseFormRegisterReturn,
  useForm,
  type UseFormProps,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitLink } from "~/config";
import { type Locale } from "~/localization/localization";
import type PropsWithClassName from "../types/propsWithClassName";
import {
  type ContactFormErrors,
  type LocalizedCopy,
} from "~/localization/copy";

const ContactFormValues = (errors: ContactFormErrors) => {
  return z.object({
    "First Name": z
      .string()
      .min(1, errors.thisFieldIsMandatory)
      .max(100, errors.thisFieldIsTooLong),
    "Last Name": z
      .string()
      .min(1, errors.thisFieldIsMandatory)
      .max(200, errors.thisFieldIsTooLong),
    Email: z
      .string()
      .min(1, errors.thisFieldIsMandatory)
      .email(errors.invalidEmail),
    Subject: z
      .string()
      .min(1, errors.thisFieldIsMandatory)
      .max(3000, errors.thisFieldIsTooLong),
    Content: z
      .string()
      .min(1, errors.thisFieldIsMandatory)
      .max(6000, errors.thisFieldIsTooLong),
  });
};

export type ContactFormType = z.infer<ReturnType<typeof ContactFormValues>>;

const inputBaseClass = "w-full border-0 border-b-2 border-charcoal/20 bg-transparent py-3 font-body text-charcoal placeholder-charcoal/40 focus:border-sienna focus:outline-none focus:ring-0 transition-colors duration-200";

function FormItem<
  FieldValuesType extends FieldValues,
  FieldNameType extends FieldPath<FieldValuesType>,
>(
  props: PropsWithClassName<{
    placeholder: string;
    register: (
      name: FieldNameType,
      options?: RegisterOptions<FieldValuesType, FieldNameType>,
    ) => UseFormRegisterReturn;
    name: FieldNameType;
    options?: RegisterOptions<FieldValuesType, FieldNameType>;
    errors: FieldErrors<FieldValuesType>;
  }>,
) {
  const errorMessages = props.errors[props.name]?.message;
  
  return (
    <div className={`flex flex-col ${props.className}`}>
      {typeof errorMessages == "string" && (
        <p className="text-xs text-red-500 mb-1">{errorMessages}</p>
      )}
      <input
        className={inputBaseClass}
        type="text"
        placeholder={props.placeholder}
        {...props.register(props.name, props.options)}
      />
    </div>
  );
}

function FormArea<
  FieldValuesType extends FieldValues,
  FieldNameType extends FieldPath<FieldValuesType>,
>(
  props: PropsWithClassName<{
    placeholder: string;
    register: (
      name: FieldNameType,
      options?: RegisterOptions<FieldValuesType, FieldNameType>,
    ) => UseFormRegisterReturn;
    name: FieldNameType;
    options?: RegisterOptions<FieldValuesType, FieldNameType>;
    errors: FieldErrors<FieldValuesType>;
  }>,
) {
  const errorMessages = props.errors[props.name]?.message;
  
  return (
    <div className={`flex flex-col ${props.className}`}>
      {typeof errorMessages == "string" && (
        <p className="text-xs text-red-500 mb-1">{errorMessages}</p>
      )}
      <textarea
        className={`${inputBaseClass} resize-none min-h-[120px]`}
        placeholder={props.placeholder}
        {...props.register(props.name, props.options)}
      />
    </div>
  );
}

const ContactForm = (
  props: PropsWithClassName<{ locale: Locale; copy: LocalizedCopy }>,
) => {
  const formProps: UseFormProps<ContactFormType> = {
    resolver: zodResolver(
      ContactFormValues(props.copy.home.contactForm.errors),
    ),
    defaultValues: {
      Email: "",
      Content: "",
      Subject: "",
      "Last Name": "",
      "First Name": "",
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<ContactFormType>(formProps);
  const contactForm = props.copy.home.contactForm;
  const submitContactForm = async (data: ContactFormType) => {
    try {
      await fetch(submitLink(data));
    } catch (error) {
      //Okay to ignore the error here. Google Forms won't return a well-formed response.
    }

    reset();
  };

  return (
    <section
      className={`${props.className} flex flex-col items-center`}
    >
      {isSubmitSuccessful && (
        <p className="text-sienna font-body">{contactForm.submitSuccessful}</p>
      )}
      <form
        className="w-full max-w-md"
        onSubmit={handleSubmit(submitContactForm)}
      >
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-8">
            <FormItem
              placeholder={contactForm.firstName}
              name="First Name"
              register={register}
              options={{ required: true }}
              errors={errors}
            />
            <FormItem
              placeholder={contactForm.lastName}
              name="Last Name"
              register={register}
              options={{ required: true }}
              errors={errors}
            />
          </div>
          <FormItem
            placeholder={contactForm.email}
            name="Email"
            register={register}
            options={{ required: true }}
            errors={errors}
          />
          <FormItem
            placeholder={contactForm.subject}
            name={"Subject"}
            register={register}
            errors={errors}
          />
          <FormArea
            placeholder={contactForm.content}
            name="Content"
            register={register}
            options={{ required: true }}
            errors={errors}
          />
        </div>
        <div className="mt-8 flex justify-center">
          <input
            className="cursor-pointer border border-charcoal px-8 py-3 font-body text-sm font-medium uppercase tracking-widest text-charcoal transition-all duration-200 hover:bg-charcoal hover:text-white"
            type="submit"
            value={props.copy.home.contactForm.send}
            lang={props.locale}
          />
        </div>
      </form>
    </section>
  );
};

export default ContactForm;
