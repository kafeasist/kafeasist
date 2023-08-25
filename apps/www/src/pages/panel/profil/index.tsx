import { Navbar } from "~/components/panel/navbar";
import { SettingsLayout } from "~/components/panel/profile/settings-layout";
import { Separator } from "~/components/ui/separator";

const SettingsAccount = () => {
  return (
    <div className="flex-col lg:flex">
      <Navbar />
      <div className="flex-1 p-8 pt-6">
        <div className="flex flex-col items-center justify-between space-y-2 lg:flex-row">
          <h2 className="text-3xl font-bold tracking-tight">Hesap ayarları</h2>
        </div>
        <div className="mt-2 text-center text-sm text-muted-foreground lg:text-left">
          Hesap ayarlarınızı buradan düzenleyebilirsiniz.
        </div>
        <Separator className="mt-6" />
      </div>
      <SettingsLayout defaultTab="profil" />
    </div>
  );
};

export default SettingsAccount;
