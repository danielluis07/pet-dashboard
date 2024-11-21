"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertProdcutSchema } from "@/db/schema";
import { useCreateProduct } from "@/queries/products/use-create-product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { UploadImage } from "@/components/upload-image";
import placeholder from "@/public/image-placeholder.jpg";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = insertProdcutSchema
  .pick({
    name: true,
    categoryId: true,
    description: true,
    imageUrl: true,
    petId: true,
    price: true,
    slug: true,
    stock: true,
    isFeatured: true,
    isNew: true,
  })
  .extend({
    price: z.string().transform((val) => parseCurrencyToCents(val)),
    stock: z.string().transform((val) => Number(val)),
  });

type FormValues = z.output<typeof formSchema>;

type PetsRequestType = InferResponseType<
  typeof client.api.pets.$get,
  200
>["data"][0];
type CategoriesRequestType = InferResponseType<
  typeof client.api.categories.$get,
  200
>["data"][0];

const formatCurrency = (value: string) => {
  const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(numericValue) / 100); // Divide by 100 for decimals
  return formattedValue;
};

const parseCurrencyToCents = (formattedValue: string): number => {
  if (!formattedValue) return 0;
  const numericValue = formattedValue.replace(/\./g, "").replace(",", ".");
  return Math.round(parseFloat(numericValue) * 100); // Multiply by 100 for cents
};

type Props = {
  pets: PetsRequestType[];
  categories: CategoriesRequestType[];
};

export const CreateProductForm = ({ pets, categories }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      description: "",
      imageUrl: "",
      petId: "",
      slug: "",
      isFeatured: false,
      isNew: false,
      price: 0,
      stock: 0,
    },
  });

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const router = useRouter();

  const mutation = useCreateProduct();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(
      { ...values, slug: generateSlug(values.name) },
      {
        onSuccess: () => {
          router.push("/dashboard/products");
        },
      }
    );
  };

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-3 w-full lg:w-1/2">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field: imageField }) => (
            <FormItem>
              <FormControl>
                <div className="flex space-x-2">
                  {form.watch("imageUrl") === "" ? (
                    <div>
                      <UploadImage
                        onChange={(url) => {
                          form.setValue("imageUrl", url);
                        }}
                        onRemove={() => {
                          form.setValue("imageUrl", "");
                        }}
                        image={form.watch("imageUrl")}
                      />
                      <Input
                        className="basis-[450px]"
                        value={imageField.value as string}
                        disabled={form.watch("imageUrl") !== ""}
                        onChange={(e) => {
                          form.setValue("imageUrl", e.target.value);
                          form.trigger("imageUrl");
                        }}
                        placeholder="ou cole a URL aqui"
                      />
                    </div>
                  ) : (
                    <div className="relative size-56">
                      <Image
                        src={form.watch("imageUrl") || placeholder}
                        alt="product image"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover rounded-md"
                      />
                      <Button
                        variant="ghost"
                        className="absolute top-2 right-2 p-2"
                        onClick={() => form.setValue("imageUrl", "")}>
                        <CircleX className="text-red-500 text-5xl" />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="slug"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="petId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pets</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um pet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pets.map((pet, index) => (
                    <SelectItem key={index} value={pet.id}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categorias</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category, index) => (
                    <SelectItem key={index} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estoque</FormLabel>
              <FormControl>
                <Input
                  placeholder="Estoque"
                  type="number"
                  {...field}
                  value={field.value ?? 1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value}
                  placeholder="0,00"
                  onChange={(e) => {
                    const formattedValue = formatCurrency(e.target.value);
                    field.onChange(formattedValue); // Atualiza o valor no formulário
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pb-5 space-y-5">
          <FormField
            control={form.control}
            name="isNew"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>É novo?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value ? "true" : "false"} // Convert boolean to string for RadioGroup
                    className="flex space-x-1">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Sim</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">Não</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>É destaque?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value ? "true" : "false"} // Convert boolean to string for RadioGroup
                    className="flex space-x-1">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Sim</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">Não</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          Criar
        </Button>
      </form>
    </Form>
  );
};
