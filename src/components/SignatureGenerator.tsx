import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Copy, Check, Mail, Phone, Globe, MapPin } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import intrucksLogo from "@/assets/intrucks-logo.png";
import intrucksLogoCol from "@/assets/intrucks-logo-col.png";
import defaultProfile from "@/assets/default-profile.png";

interface SignatureData {
  name: string;
  position: string;
  phone: string;
  officePhone: string;
  email: string;
  photo: string;
}

type SignatureType = 'usa' | 'col';

const ADDRESS_MAP = {
  usa: '6750 N. Andrews Ave, Fort Lauderdale, FL 33309',
  col: 'Carrera 49a 61sur 75 oficina 404 Centro Ejecutivo Sabana 2'
};

// Schema de validación con zod para prevenir inyecciones y asegurar datos válidos
const signatureSchema = z.object({
  name: z.string().trim().min(1, {
    message: "El nombre es requerido"
  }).max(100, {
    message: "El nombre debe tener menos de 100 caracteres"
  }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, {
    message: "El nombre contiene caracteres no válidos"
  }),
  position: z.string().trim().min(1, {
    message: "El cargo es requerido"
  }).max(100, {
    message: "El cargo debe tener menos de 100 caracteres"
  }),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
    message: "Formato de teléfono inválido. Debe ser (XXX) XXX-XXXX"
  }),
  officePhone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
    message: "Formato de teléfono inválido. Debe ser (XXX) XXX-XXXX"
  }),
  email: z.string().trim().email({
    message: "Email inválido"
  }).max(255, {
    message: "El email debe tener menos de 255 caracteres"
  }).regex(/@intruckscorp\.com$/, {
    message: "Solo se permiten correos @intruckscorp.com"
  }),
  photo: z.string().max(5000000, {
    message: "La imagen es demasiado grande"
  })
});

// Función para escapar HTML - solo se usa para generar el HTML que se copia al clipboard
const escapeHtml = (text: string): string => {
  const map: {
    [key: string]: string;
  } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;'
  };
  return text.replace(/[&<>"'/]/g, char => map[char]);
};

// Componente seguro de preview - renderiza usando JSX sin dangerouslySetInnerHTML
const SignaturePreview = ({
  data,
  showPosition,
  signatureType
}: {
  data: SignatureData;
  showPosition: boolean;
  signatureType: SignatureType;
}) => {
  const photoSrc = data.photo || defaultProfile;
  const address = ADDRESS_MAP[signatureType];
  
  return (
    <table cellPadding="0" cellSpacing="0" style={{
      fontFamily: "'Segoe UI', Arial, sans-serif",
      width: '700px',
      maxWidth: '700px',
      background: '#ffffff'
    }}>
      <tbody>
        <tr>
          <td width="200" style={{
            padding: '30px',
            verticalAlign: 'middle',
            textAlign: 'center'
          }}>
            <img src={photoSrc} alt={data.name} width="180" height="180" style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              display: 'block',
              margin: '0 auto',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: !data.photo ? 'opacity(0.4)' : 'none',
              pointerEvents: 'none',
              cursor: 'default'
            }} />
            
            <div style={{
              textAlign: 'left',
              marginTop: '20px'
            }}>
              <img src={signatureType === 'col' ? intrucksLogoCol : intrucksLogo} alt="InTrucks Corp" width="140" height="auto" style={{
                height: 'auto',
                width: '140px',
                display: 'inline-block'
              }} />
            </div>
          </td>
          
          <td style={{
            padding: '30px 40px 30px 20px',
            verticalAlign: 'middle'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#000000',
              margin: '0 0 8px 0',
              lineHeight: '1.2',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              {data.name}
            </h2>
            
            {((signatureType === 'col' && data.position) || (showPosition && data.position)) && (
              <p style={{
                fontSize: '16px',
                color: '#5da89c',
                margin: '0 0 15px 0',
                fontWeight: 400
              }}>
                {data.position}
              </p>
            )}
            
            <div style={{
              height: '2px',
              background: '#5da89c',
              margin: '15px 0 20px 0'
            }}></div>
            
            <table cellPadding="0" cellSpacing="0" style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#000000',
              borderCollapse: 'collapse'
            }}>
              <tbody>
                <tr>
                  <td width="35" style={{ padding: '5px 0', width: '35px', verticalAlign: 'middle' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #5da89c',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Mail size={14} color="#5da89c" strokeWidth={2.5} />
                    </div>
                  </td>
                  <td style={{ padding: '5px 0 5px 8px', verticalAlign: 'middle' }}>
                    <a href={`mailto:${data.email}`} style={{
                      color: '#000000',
                      textDecoration: 'none',
                      display: 'block'
                    }}>
                      {data.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td width="35" style={{ padding: '5px 0', width: '35px', verticalAlign: 'middle' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #5da89c',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Phone size={14} color="#5da89c" strokeWidth={2.5} />
                    </div>
                  </td>
                  <td style={{ padding: '5px 0 5px 8px', verticalAlign: 'middle' }}>
                    <span style={{
                      color: '#666666',
                      fontSize: '11px',
                      marginRight: '6px'
                    }}>Personal:</span>
                    <a href={`tel:${data.phone.replace(/\D/g, '')}`} style={{
                      color: '#000000',
                      textDecoration: 'none',
                      marginRight: '15px'
                    }}>
                      {data.phone}
                    </a>
                    <span style={{
                      color: '#666666',
                      fontSize: '11px',
                      marginRight: '6px'
                    }}>Oficina:</span>
                    <a href={`tel:${data.officePhone.replace(/\D/g, '')}`} style={{
                      color: '#000000',
                      textDecoration: 'none'
                    }}>
                      {data.officePhone}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td width="35" style={{ padding: '5px 0', width: '35px', verticalAlign: 'middle' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #5da89c',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Globe size={14} color="#5da89c" strokeWidth={2.5} />
                    </div>
                  </td>
                  <td style={{ padding: '5px 0 5px 8px', verticalAlign: 'middle' }}>
                    <a href="https://www.intruckscorp.com" style={{
                      color: '#000000',
                      textDecoration: 'none',
                      display: 'block'
                    }}>
                      www.intruckscorp.com
                    </a>
                  </td>
                </tr>
                <tr>
                  <td width="35" style={{ padding: '5px 0', width: '35px', verticalAlign: 'middle' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #5da89c',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <MapPin size={14} color="#5da89c" strokeWidth={2.5} />
                    </div>
                  </td>
                  <td style={{ padding: '5px 0 5px 8px', verticalAlign: 'middle' }}>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} style={{
                      color: '#000000',
                      textDecoration: 'none',
                      display: 'block',
                      whiteSpace: 'nowrap'
                    }}>
                      {address}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const SignatureGenerator = () => {
  const [signatureDataUSA, setSignatureDataUSA] = useState<SignatureData>({
    name: "David Ruiz",
    position: "General Manager",
    phone: "",
    officePhone: "",
    email: "david@intruckscorp.com",
    photo: ""
  });
  const [signatureDataCOL, setSignatureDataCOL] = useState<SignatureData>({
    name: "David Ruiz",
    position: "General Manager",
    phone: "",
    officePhone: "",
    email: "david@intruckscorp.com",
    photo: ""
  });
  const [copiedUSA, setCopiedUSA] = useState(false);
  const [copiedCOL, setCopiedCOL] = useState(false);
  const [showPositionUSA, setShowPositionUSA] = useState(false);
  const [showPositionCOL, setShowPositionCOL] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 10);

    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `(${limitedNumbers.slice(0, 3)}) ${limitedNumbers.slice(3)}`;
    } else {
      return `(${limitedNumbers.slice(0, 3)}) ${limitedNumbers.slice(3, 6)}-${limitedNumbers.slice(6)}`;
    }
  };

  const handlePhoneChange = (signatureType: SignatureType, field: 'phone' | 'officePhone', value: string) => {
    const formatted = formatPhoneNumber(value);
    if (signatureType === 'usa') {
      setSignatureDataUSA({
        ...signatureDataUSA,
        [field]: formatted
      });
    } else {
      setSignatureDataCOL({
        ...signatureDataCOL,
        [field]: formatted
      });
    }
  };

  const handleImageUpload = (signatureType: SignatureType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Solo se permiten imágenes JPG, PNG o WEBP");
        return;
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("La imagen debe ser menor a 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (signatureType === 'usa') {
          setSignatureDataUSA({
            ...signatureDataUSA,
            photo: reader.result as string
          });
        } else {
          setSignatureDataCOL({
            ...signatureDataCOL,
            photo: reader.result as string
          });
        }
      };
      reader.onerror = () => {
        toast.error("Error al cargar la imagen");
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSignatureHTML = async (signatureType: SignatureType): Promise<string> => {
    const signatureData = signatureType === 'usa' ? signatureDataUSA : signatureDataCOL;
    const showPosition = signatureType === 'usa' ? showPositionUSA : showPositionCOL;
    const address = ADDRESS_MAP[signatureType];
    
    try {
      signatureSchema.parse(signatureData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
        return '';
      }
    }

    // Función para convertir imagen a base64
    const imageToBase64 = async (src: string): Promise<string> => {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error converting image to base64:', error);
        return src;
      }
    };

    const safeName = escapeHtml(signatureData.name);
    const safePosition = escapeHtml(signatureData.position);
    const safeEmail = escapeHtml(signatureData.email);
    const safePhone = escapeHtml(signatureData.phone);
    const safeOfficePhone = escapeHtml(signatureData.officePhone);
    const photoSrc = signatureData.photo || await imageToBase64(defaultProfile);
    const photoFilter = !signatureData.photo ? 'filter: opacity(0.4);' : '';
    const logoSrc = await imageToBase64(signatureType === 'col' ? intrucksLogoCol : intrucksLogo);
    const addressNoBreak = escapeHtml(address).replace(/ /g, '&nbsp;');
    
    return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; width: 500px !important; max-width: 500px !important; background: #ffffff; border-collapse: collapse;">
  <tr>
    <td width="140" style="padding: 16px; vertical-align: middle; text-align: center; width: 140px !important;">
      <img src="${photoSrc}" alt="${safeName}" width="120" height="120" style="width: 120px !important; height: 120px !important; min-width: 120px !important; min-height: 120px !important; max-width: 120px !important; max-height: 120px !important; border-radius: 50%; display: block; margin: 0 auto; object-fit: cover; object-position: center; ${photoFilter}" />
      <div style="text-align: center; margin-top: 12px;">
        <img src="${logoSrc}" alt="InTrucks Corp" width="90" height="auto" style="width: 90px !important; height: auto !important; max-width: 90px !important; display: block; margin: 0 auto;" />
      </div>
    </td>
    <td style="padding: 16px 22px 16px 12px; vertical-align: middle;">
      <h2 style="font-size: 22px; font-weight: 700; color: #000000; margin: 0 0 4px 0; line-height: 1.2; text-transform: uppercase; letter-spacing: 1px;">
        ${safeName}
      </h2>
      ${(signatureType === 'col' && signatureData.position) || (showPosition && signatureData.position) ? `<p style=\"font-size: 12px; color: #5da89c; margin: 0 0 8px 0; font-weight: 400;\">\n        ${safePosition}\n      </p>` : ''}
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 8px 0 10px 0;">
        <tr>
          <td style="height: 2px; background-color: #5da89c; line-height: 0; font-size: 0;">&nbsp;</td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; line-height: 1.5; color: #000000; border-collapse: collapse;">
        <tr>
          <td width="30" style="padding: 4px 0; width: 30px; vertical-align: middle;">
            <div style="width: 24px; height: 24px; background-color: #ffffff; border: 2px solid #5da89c; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5da89c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
          </td>
          <td style="padding: 4px 0 4px 8px; vertical-align: middle;">
            <a href="mailto:${safeEmail}" style="color: #000000; text-decoration: none; display: block;">
              ${safeEmail}
            </a>
          </td>
        </tr>
        <tr>
          <td width="30" style="padding: 4px 0; width: 30px; vertical-align: middle;">
            <div style="width: 24px; height: 24px; background-color: #ffffff; border: 2px solid #5da89c; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5da89c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
          </td>
          <td style="padding: 4px 0 4px 8px; vertical-align: middle;">
            <span style="color: #666666; font-size: 10px; margin-right: 6px;">Personal:</span>
            <a href="tel:${signatureData.phone.replace(/\D/g, '')}" style="color: #000000; text-decoration: none; margin-right: 12px;">
              ${safePhone}
            </a>
            <span style="color: #666666; font-size: 10px; margin-right: 6px;">Oficina:</span>
            <a href="tel:${signatureData.officePhone.replace(/\D/g, '')}" style="color: #000000; text-decoration: none;">
              ${safeOfficePhone}
            </a>
          </td>
        </tr>
        <tr>
          <td width="30" style="padding: 4px 0; width: 30px; vertical-align: middle;">
            <div style="width: 24px; height: 24px; background-color: #ffffff; border: 2px solid #5da89c; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5da89c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
          </td>
          <td style="padding: 4px 0 4px 8px; vertical-align: middle;">
            <a href="https://www.intruckscorp.com" style="color: #000000; text-decoration: none; display: block;">
              www.intruckscorp.com
            </a>
          </td>
        </tr>
        <tr>
          <td width="30" style="padding: 4px 0; width: 30px; vertical-align: middle;">
            <div style="width: 24px; height: 24px; background-color: #ffffff; border: 2px solid #5da89c; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5da89c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </td>
          <td style="padding: 4px 0 4px 8px; vertical-align: middle;">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}" style="color: #000000; text-decoration: none; display: inline-block; white-space: nowrap;">
              ${addressNoBreak}
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    `.trim();
  };

  const copyToClipboard = async (signatureType: SignatureType) => {
    const setCopied = signatureType === 'usa' ? setCopiedUSA : setCopiedCOL;
    try {
      toast.info("Generando firma...");
      const html = await generateSignatureHTML(signatureType);
      if (!html) return;
      
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html], { type: "text/plain" })
        })
      ]);
      setCopied(true);
      toast.success("Firma copiada al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Error al copiar la firma");
    }
  };

  const renderEditorPanel = (idPrefix: string, signatureType: SignatureType) => {
    const signatureData = signatureType === 'usa' ? signatureDataUSA : signatureDataCOL;
    const setSignatureData = signatureType === 'usa' ? setSignatureDataUSA : setSignatureDataCOL;
    const showPosition = signatureType === 'usa' ? showPositionUSA : showPositionCOL;
    const setShowPosition = signatureType === 'usa' ? setShowPositionUSA : setShowPositionCOL;
    const copied = signatureType === 'usa' ? copiedUSA : copiedCOL;

    return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Datos del Empleado</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor={`photo-${idPrefix}`}>Foto del Empleado</Label>
          <div className="mt-2">
            <label htmlFor={`photo-${idPrefix}`} className="cursor-pointer">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                {signatureData.photo ? (
                  <img src={signatureData.photo} alt="Preview" className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-secondary" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-12 h-12 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Haz clic para subir una foto
                    </span>
                  </div>
                )}
              </div>
              <Input id={`photo-${idPrefix}`} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(signatureType, e)} />
            </label>
          </div>
        </div>

        <div>
          <Label htmlFor={`name-${idPrefix}`}>Nombre Completo</Label>
          <Input
            id={`name-${idPrefix}`}
            value={signatureData.name}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 100) {
                setSignatureData({ ...signatureData, name: value });
              }
            }}
            placeholder="Pepito Perez"
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {signatureData.name.length}/100 caracteres
          </p>
        </div>

        <div>
          {signatureType === 'usa' && (
            <div className="flex items-center gap-2 mb-2">
              <Checkbox 
                id={`show-position-${idPrefix}`}
                checked={showPosition}
                onCheckedChange={(checked) => setShowPosition(checked as boolean)}
              />
              <Label htmlFor={`position-${idPrefix}`}>Cargo</Label>
            </div>
          )}
          {signatureType === 'col' && (
            <Label htmlFor={`position-${idPrefix}`}>Cargo</Label>
          )}
          <Input
            id={`position-${idPrefix}`}
            value={signatureData.position}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 100) {
                setSignatureData({ ...signatureData, position: value });
              }
            }}
            placeholder={signatureType === 'col' ? "Gerente de asuntos no importantes" : "Ej: General Manager"}
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {signatureData.position.length}/100 caracteres
          </p>
        </div>

        <div>
          <Label htmlFor={`phone-${idPrefix}`}>Teléfono personal</Label>
          <Input
            id={`phone-${idPrefix}`}
            value={signatureData.phone}
            onChange={(e) => handlePhoneChange(signatureType, 'phone', e.target.value)}
            placeholder="Ej: (000) 000-0000"
          />
        </div>

        <div>
          <Label htmlFor={`officePhone-${idPrefix}`}>Teléfono Oficina</Label>
          <Input
            id={`officePhone-${idPrefix}`}
            value={signatureData.officePhone}
            onChange={(e) => handlePhoneChange(signatureType, 'officePhone', e.target.value)}
            placeholder="Ej: (000) 000-0000"
          />
        </div>

        <div>
          <Label htmlFor={`email-${idPrefix}`}>Correo Electrónico</Label>
          <Input
            id={`email-${idPrefix}`}
            type="email"
            value={signatureData.email}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 255) {
                setSignatureData({ ...signatureData, email: value });
              }
            }}
            placeholder="Ej: micorreo@intruckscorp.com"
            maxLength={255}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Debe ser un correo @intruckscorp.com
          </p>
        </div>

        <Button onClick={() => copyToClipboard(signatureType)} className="w-full" size="lg">
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
    );
  };

  const renderPreviewPanel = (signatureType: SignatureType) => {
    const signatureData = signatureType === 'usa' ? signatureDataUSA : signatureDataCOL;
    const showPosition = signatureType === 'usa' ? showPositionUSA : showPositionCOL;

    return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Vista Previa</h2>
      <div className="bg-muted/30 rounded-lg p-4 overflow-auto">
        <SignaturePreview data={signatureData} showPosition={showPosition} signatureType={signatureType} />
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
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Generador de firmas In Trucks
        </h1>
        <p className="text-muted-foreground">No es dar el paso sino dejar la huella</p>
      </div>

      <Tabs defaultValue="usa" className="max-w-7xl mx-auto">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="usa">Firma USA</TabsTrigger>
          <TabsTrigger value="col">Firma COL</TabsTrigger>
        </TabsList>

        <TabsContent value="usa">
          <div className="grid lg:grid-cols-2 gap-8">
            {renderEditorPanel('usa', 'usa')}
            {renderPreviewPanel('usa')}
          </div>
        </TabsContent>

        <TabsContent value="col">
          <div className="grid lg:grid-cols-2 gap-8">
            {renderEditorPanel('col', 'col')}
            {renderPreviewPanel('col')}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
