"use client";

import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Download, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Spinner,
} from "@kafeasist/ui";

import { useSession } from "~/hooks/use-session";
import { api } from "~/utils/api";

export function Security() {
  const { session } = useSession();

  const { mutateAsync: mutateDisable2FA, isPending: isDisable2FAPending } =
    api.user.disable2FA.useMutation();
  const {
    mutateAsync: mutateResendVerificationEmail,
    isPending: isResendVerificationEmailPending,
  } = api.user.resendVerificationEmail.useMutation();

  const [dialogStep, setDialogStep] = useState<number>(1);
  const [accept, setAccept] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  if (!session) return null;

  return (
    <Card id="guvenlik">
      <div className="space-y-1 p-6">
        <h2 className="font-bold">Güvenlik ayarları</h2>
        <p className="text-sm text-muted-foreground">
          Hesabınızın güvenlik ayarlarını güncelleyin.
        </p>
      </div>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full items-center justify-between space-y-4 rounded-xl border border-border p-6 md:flex md:space-y-0">
            <div>
              <h3 className="text-sm font-bold">
                {!!session.emailVerified && (
                  <Badge variant="outline" className="mr-1.5">
                    Etkin
                  </Badge>
                )}
                E-posta doğrulama
              </h3>
              <p className="text-sm text-muted-foreground">
                {!!session.emailVerified
                  ? "Harika, e-postanız doğrulanmış."
                  : "Hesabınızdaki bazı özelliklere erişmek için e-postanızı doğrulayın."}
              </p>
            </div>
            {!session.emailVerified && (
              <Button
                className="w-full md:w-auto"
                onClick={async () => {
                  const result = await mutateResendVerificationEmail();

                  if (result.error) {
                    toast.error(result.message);
                    return;
                  }

                  toast.success(result.message);
                }}
                loading={isResendVerificationEmailPending}
              >
                <Mail className="mr-2 size-4" /> Tekrar gönder
              </Button>
            )}
          </div>
          <div className="w-full items-center justify-between space-y-4 rounded-xl border border-border p-6 md:flex md:space-y-0">
            <div>
              <h3 className="text-sm font-bold">
                {!!session.twoFA && (
                  <Badge variant="outline" className="mr-1.5">
                    Etkin
                  </Badge>
                )}
                Çift faktörlü kimlik doğrulama
              </h3>
              <p className="text-sm text-muted-foreground">
                {!!session.twoFA
                  ? "Harika, çift faktörlü kimlik doğrulama etkin."
                  : "Hesabınızı korumak için çift faktörlü doğrulamayı etkinleştirin."}
              </p>
            </div>
            {!!session.twoFA ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full md:w-auto">
                    Devre dışı bırak
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Kimlik doğrulamayı devre dışı bırak
                    </DialogTitle>
                  </DialogHeader>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Çift faktörlü kimlik doğrulamayı devre dışı bırakmak
                      istediğinize emin misiniz?
                    </p>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isDisable2FAPending}>
                        Vazgeç
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      loading={isDisable2FAPending}
                      onClick={async () => {
                        const result = await mutateDisable2FA();

                        if (result.error) {
                          toast.error(result.message);
                          return;
                        }

                        toast.success(result.message);
                        window.location.reload();
                      }}
                    >
                      Devre dışı bırak
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">Etkinleştir</Button>
                </DialogTrigger>
                {dialogStep === 1 ? (
                  <TwoFADialog1 stepFn={setDialogStep} />
                ) : dialogStep === 2 ? (
                  <TwoFADialog2
                    stepFn={setDialogStep}
                    accept={accept}
                    setAccept={setAccept}
                  />
                ) : dialogStep === 3 ? (
                  <TwoFADialog3
                    stepFn={setDialogStep}
                    setRecoveryCodes={setRecoveryCodes}
                  />
                ) : dialogStep === 4 ? (
                  <TwoFADialog4
                    saved={saved}
                    setSaved={setSaved}
                    recoveryCodes={recoveryCodes}
                  />
                ) : null}
              </Dialog>
            )}
          </div>
          <div className="w-full items-center justify-between space-y-4 rounded-xl border border-border p-6 md:flex md:space-y-0">
            <div>
              <h3 className="text-sm font-bold">İkincil e-posta adresi</h3>
              <p className="text-sm text-muted-foreground">
                {!!session.twoFA
                  ? "Harika, ikincil e-posta adresi aktif."
                  : "Hesabınızı korumak için ikincil bir e-posta adresi ekleyin."}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <Input placeholder={session.email} />
              <Button className="w-full md:w-auto">Ekle</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DialogProps {
  stepFn: Dispatch<SetStateAction<number>>;
}

function TwoFADialog1({ stepFn }: DialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Çift faktörlü kimlik doğrulama</DialogTitle>
      </DialogHeader>
      <div>
        <p className="text-sm text-muted-foreground">
          Çift faktörlü kimlik doğrulama, hesabınıza giriş yaparken ek bir
          güvenlik katmanı sağlar. Hesabınızı korumak için çift faktörlü kimlik
          doğrulamayı etkinleştirmenizi öneririz.
        </p>
        <div className="flex justify-center">
          <Image
            src="/security.gif"
            alt="Security GIF"
            width={200}
            height={200}
            unoptimized
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Bu işlem için telefonunuzda bir kimlik doğrulama uygulaması
          kullanmanız gerekmektedir. İşleme devam etmek için yanınızda
          telefonunuzun olduğuna emin olun.
        </p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="destructive">Vazgeç</Button>
        </DialogClose>
        <Button onClick={() => stepFn((value) => value + 1)}>Devam et</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function TwoFADialog2({
  stepFn,
  accept,
  setAccept,
}: DialogProps & {
  accept: boolean;
  setAccept: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Kimlik doğrulama uygulaması</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Telefonunuzda bir kimlik doğrulama uygulaması kullanarak çift faktörlü
          kimlik doğrulamayı etkinleştirebilirsiniz.
        </p>
        <p className="text-sm text-muted-foreground">
          Bu işlem için telefonunuzda Google Authenticator, Authy veya benzeri
          bir uygulama kullanabilirsiniz. Seçtiğiniz uygulamayı telefonunuza
          indirdiğinizden emin olun.
        </p>
        <p className="text-sm text-muted-foreground">
          Bundan sonraki adımları tamamladıktan sonra kimlik doğrulama
          uygulaması ile hesabınızı koruyabilirsiniz. Seçtiğiniz uygulama ile
          kafeasist hesabınızı eşleştirdikten sonra tüm sorumluluk size aittir.
        </p>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="accept"
            checked={accept}
            onCheckedChange={() => setAccept((value) => !value)}
          />
          <label htmlFor="accept" className="text-sm leading-none">
            Kimlik doğrulama sorumluluğunu kabul ediyorum.
          </label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => stepFn((value) => value - 1)}>
          Geri dön
        </Button>
        <Button disabled={!accept} onClick={() => stepFn((value) => value + 1)}>
          Devam et
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function TwoFADialog3({
  stepFn,
  setRecoveryCodes,
}: DialogProps & { setRecoveryCodes: Dispatch<SetStateAction<string[]>> }) {
  const { mutateAsync: mutateGenerate, isPending: isGeneratePending } =
    api.user.generate2FA.useMutation();
  const { mutateAsync: mutateVerify, isPending: isVerifyPending } =
    api.user.verify2FA.useMutation();

  const [qrCode, setQRCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");

  const FormSchema = z.object({
    pin: z
      .string({
        required_error: "Kimlik doğrulama kodu boş bırakılamaz.",
      })
      .min(6, {
        message: "Kimlik doğrulama kodunuz 6 haneli olmalıdır.",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await mutateVerify(data);

    if (result.error) {
      form.setError("pin", {
        message: result.message,
      });
      return;
    }

    setRecoveryCodes(result.message.split(" "));

    stepFn((value) => value + 1);
  }

  useLayoutEffect(() => {
    async function getQRCode() {
      const response = await mutateGenerate();

      if (response.error) {
        toast.error(response.message);
        return;
      }

      const qrCodeURL = response.message.split(" ")[0];
      const secret = response.message.split(" ")[1];

      if (!qrCodeURL || !secret) {
        toast.error("QR kodu oluşturulurken bir hata oluştu.");
        return;
      }

      setQRCode(qrCodeURL);
      setSecret(secret);
    }

    getQRCode();
  }, []);

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    toast.success("Kimlik doğrulama anahtarı kopyalandı.");
  };

  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Cihazınızla hesabınızı eşleştirin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Kimlik doğrulama uygulamasını telefonunuza indirdikten sonra
              aşağıdaki QR kodu ile uygulamayı eşleştirin.
            </p>
            <div className="flex justify-center">
              {isGeneratePending ? (
                <Spinner />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Image
                    src={qrCode}
                    alt="Eşleştirmek için QR kodu"
                    height={200}
                    width={200}
                  />
                  <span className="text-center text-sm text-muted-foreground">
                    <strong>VEYA</strong> bu kodu uygulamanıza girin:
                  </span>
                  <div className="flex items-center space-x-2">
                    <code className="rounded-lg border border-dashed border-border bg-secondary px-3 py-1">
                      {secret}
                    </code>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={copySecret}
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Kimlik doğrulama uygulamasında oluşturulan 6 haneli kodu
                aşağıdaki alana girin ve kimlik doğrulamayı tamamlayın.
              </p>
              <div className="flex justify-center">
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isGeneratePending || isVerifyPending}
              onClick={() => stepFn((value) => value - 1)}
            >
              Geri dön
            </Button>
            <Button
              type="submit"
              disabled={isGeneratePending || isVerifyPending}
            >
              Devam et
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

function TwoFADialog4({
  saved,
  setSaved,
  recoveryCodes,
}: {
  saved: boolean;
  setSaved: Dispatch<SetStateAction<boolean>>;
  recoveryCodes: string[];
}) {
  function copyCodes() {
    navigator.clipboard.writeText(recoveryCodes.join(" "));
    toast.success("Kurtarma kodları kopyalandı.");
  }

  function downloadCodes() {
    const element = document.createElement("a");

    const file = new Blob([recoveryCodes.join(" ")], {
      type: "text/plain",
    });

    element.href = URL.createObjectURL(file);
    element.download = "kafeasist-kurtarma-kodlari.txt";

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("Kurtarma kodları indirildi.");
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Kurtarma kodları</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Kimlik doğrulama uygulaması ile hesabınızı eşleştirdikten sonra
          kurtarma kodlarınızı güvenli bir yere kaydedin. Kimlik doğrulama
          uygulaması çalışmadığında bu kodları kullanarak hesabınıza giriş
          yapabilirsiniz.
        </p>
        <div className="mx-auto flex w-3/4 rounded-md bg-secondary p-1">
          <div className="grid w-full grid-cols-3">
            {recoveryCodes.map((code, index) => (
              <code key={index} className="col-span-1 text-center">
                {code}
              </code>
            ))}
          </div>
        </div>
        <div className="mx-auto flex w-3/4 gap-3">
          <Button className="w-full" size="fit" onClick={downloadCodes}>
            <Download className="mr-2 h-4 w-4" /> İndir
          </Button>
          <Button className="w-full" size="fit" onClick={copyCodes}>
            <Copy className="mr-2 h-4 w-4" /> Kopyala
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="saved"
            checked={saved}
            onCheckedChange={() => setSaved((value) => !value)}
          />
          <label htmlFor="saved" className="text-sm leading-none">
            Kurtarma kodlarınının önemini anladım ve güvenli bir yere kaydettim.
          </label>
        </div>
      </div>
      <DialogFooter>
        <Button disabled={!saved} onClick={() => window.location.reload()}>
          Tamamla
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
