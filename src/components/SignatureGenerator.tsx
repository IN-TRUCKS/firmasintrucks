import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Copy, Check, Phone, Mail, MapPin, Globe } from "lucide-react";
import { toast } from "sonner";
import intrucksLogo from "@/assets/intrucks-logo.png";

interface SignatureData {
  name: string;
  position: string;
  phone: string;
  officePhone: string;
  email: string;
  photo: string;
}

export const SignatureGenerator = () => {
  const [signatureData, setSignatureData] = useState<SignatureData>({
    name: "David Ruiz",
    position: "General Manager",
    phone: "(754) 757-0996",
    officePhone: "(954) 280-3218",
    email: "david@intruckscorp.com",
    photo: "",
  });

  const [copied, setCopied] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureData({ ...signatureData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSignatureHTML = () => {
    const photoSrc = signatureData.photo || 'https://via.placeholder.com/140';
    
    return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; width: 650px; max-width: 650px; background: #ffffff; border-left: 4px solid #5da89c;">
  <tr>
    <td style="padding: 25px 30px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 590px;">
        <!-- Header Row: Logo -->
        <tr>
          <td colspan="3" style="padding-bottom: 20px; border-bottom: 2px solid #f0f0f0;">
            <img src="${intrucksLogo}" alt="InTrucks Corp" style="height: 40px; display: block;" />
          </td>
        </tr>
        
        <!-- Main Content Row -->
        <tr>
          <td style="padding-top: 20px; padding-right: 25px; vertical-align: top; width: 140px;">
            <!-- Photo -->
            <img src="${photoSrc}" alt="${signatureData.name}" style="width: 140px; height: 140px; border-radius: 50%; border: 3px solid #5da89c; object-fit: cover; display: block; box-shadow: 0 3px 10px rgba(0,0,0,0.1);" />
          </td>
          
          <td style="padding-top: 20px; padding-right: 25px; vertical-align: top; width: 250px;">
            <!-- Name and Position -->
            <div style="margin-bottom: 15px;">
              <div style="font-size: 24px; font-weight: 600; color: #2c3e50; margin-bottom: 4px; letter-spacing: -0.5px;">${signatureData.name}</div>
              <div style="font-size: 13px; color: #5da89c; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${signatureData.position}</div>
            </div>
            
            <!-- Contact Info Column 1 -->
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding: 4px 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width: 18px; vertical-align: middle; padding-right: 8px;">
                        <span style="color: #5da89c; font-size: 13px;">📱</span>
                      </td>
                      <td style="vertical-align: middle;">
                        <a href="tel:${signatureData.phone.replace(/\D/g, '')}" style="color: #2c3e50; text-decoration: none; font-size: 13px; font-weight: 500;">${signatureData.phone}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width: 18px; vertical-align: middle; padding-right: 8px;">
                        <span style="color: #5da89c; font-size: 13px;">☎️</span>
                      </td>
                      <td style="vertical-align: middle;">
                        <a href="tel:${signatureData.officePhone.replace(/\D/g, '')}" style="color: #2c3e50; text-decoration: none; font-size: 13px; font-weight: 500;">${signatureData.officePhone}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width: 18px; vertical-align: middle; padding-right: 8px;">
                        <span style="color: #5da89c; font-size: 13px;">✉️</span>
                      </td>
                      <td style="vertical-align: middle;">
                        <a href="mailto:${signatureData.email}" style="color: #1e4d8b; text-decoration: none; font-size: 13px; font-weight: 500;">${signatureData.email}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
          
          <td style="padding-top: 20px; vertical-align: top; border-left: 2px solid #f0f0f0; padding-left: 25px; width: 175px;">
            <!-- Address and Website Column -->
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding: 4px 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width: 18px; vertical-align: top; padding-right: 8px; padding-top: 1px;">
                        <span style="color: #5da89c; font-size: 12px;">📍</span>
                      </td>
                      <td style="vertical-align: top;">
                        <span style="font-size: 11px; color: #666; line-height: 1.5;">6750 N. Andrews Ave, Suite 200<br/>Fort Lauderdale, FL 33309</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width: 18px; vertical-align: middle; padding-right: 8px;">
                        <span style="color: #5da89c; font-size: 12px;">🌐</span>
                      </td>
                      <td style="vertical-align: middle;">
                        <a href="https://www.intruckscorp.com" style="color: #1e4d8b; text-decoration: none; font-size: 11px; font-weight: 500;">www.intruckscorp.com</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- License Info -->
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #f0f0f0;">
              <div style="font-size: 9px; color: #888; line-height: 1.5;">
                <div style="font-weight: 600; color: #666;">IN TRUCKS INSURANCE CORP</div>
                <div>IN CALIFORNIA DBA IN TRUCKS</div>
                <div>INSURANCE SOLUTIONS</div>
                <div>LICENSE # 6006644</div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    `.trim();
  };

  const copyToClipboard = async () => {
    const html = generateSignatureHTML();
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html], { type: "text/plain" }),
        }),
      ]);
      setCopied(true);
      toast.success("Firma copiada al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Error al copiar la firma");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Generador de Firmas InTrucks Corp
        </h1>
        <p className="text-muted-foreground">
          Crea firmas de correo electrónico profesionales para tu equipo
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Editor Panel */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Datos del Empleado</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="photo">Foto del Empleado</Label>
              <div className="mt-2">
                <label htmlFor="photo" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                    {signatureData.photo ? (
                      <img
                        src={signatureData.photo}
                        alt="Preview"
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-secondary"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-12 h-12 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Haz clic para subir una foto
                        </span>
                      </div>
                    )}
                  </div>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={signatureData.name}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, name: e.target.value })
                }
                placeholder="Ej: David Ruiz"
              />
            </div>

            <div>
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                value={signatureData.position}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, position: e.target.value })
                }
                placeholder="Ej: General Manager"
              />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono Móvil</Label>
              <Input
                id="phone"
                value={signatureData.phone}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, phone: e.target.value })
                }
                placeholder="Ej: (754) 757-0996"
              />
            </div>

            <div>
              <Label htmlFor="officePhone">Teléfono Oficina</Label>
              <Input
                id="officePhone"
                value={signatureData.officePhone}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, officePhone: e.target.value })
                }
                placeholder="Ej: (954) 280-3218"
              />
            </div>

            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={signatureData.email}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, email: e.target.value })
                }
                placeholder="Ej: david@intruckscorp.com"
              />
            </div>

            <Button 
              onClick={copyToClipboard} 
              className="w-full"
              size="lg"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Firma para Correo
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Preview Panel */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Vista Previa</h2>
          <div className="bg-muted/30 rounded-lg p-4 overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: generateSignatureHTML() }} />
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Instrucciones:</strong>
            </p>
            <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
              <li>Completa todos los campos del empleado</li>
              <li>Haz clic en "Copiar Firma para Correo"</li>
              <li>Abre tu cliente de correo (Gmail, Outlook, etc.)</li>
              <li>Ve a configuración de firma</li>
              <li>Pega la firma (Ctrl+V o Cmd+V)</li>
              <li>El teléfono y correo serán clickeables automáticamente</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
};
