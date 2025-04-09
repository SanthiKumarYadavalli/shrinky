
import { useState } from "react";
import { Loader, QrCode } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface QRCodeDialogProps {
  url: string;
  title?: string;
}

export const QRCodeDialog = ({ url, title }: QRCodeDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate QR code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          title="Show QR Code"
          className="h-8 w-8"
        >
          <QrCode className="h-4 w-4" />
          <span className="sr-only">QR Code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to open the shortened link.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg">
            {isLoading && (
              <div className="flex items-center justify-center w-[200px] h-[200px]">
                <Skeleton className="w-full h-full absolute" />
                <Loader className="h-8 w-8 text-primary animate-spin relative" />
              </div>
            )}
            <img 
              src={qrCodeUrl}
              alt="QR Code"
              width={200}
              height={200}
              className={`m-0 ${isLoading ? 'invisible h-0' : 'visible'}`}
              onLoad={() => setIsLoading(false)}
            />
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <p className="mb-2"><span className="font-mono break-all">{url}</span></p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
