import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Copy, Check, Mail, Phone, Globe, MapPin, Youtube, Instagram, MessageCircle, Facebook, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import intrucksLogo from "@/assets/intrucks-logo.png";
import defaultProfile from "@/assets/default-profile.png";
interface SignatureData {
  name: string;
  position: string;
  phone: string;
  officePhone: string;
  email: string;
  photo: string;
}

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
  }) // ~5MB en base64
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
  showPosition
}: {
  data: SignatureData;
  showPosition: boolean;
}) => {
  const photoSrc = data.photo || defaultProfile;
  return <table cellPadding="0" cellSpacing="0" style={{
    fontFamily: "'Segoe UI', Arial, sans-serif",
    width: '700px',
    maxWidth: '700px',
    background: '#ffffff'
  }}>
      <tbody>
        <tr>
          {/* Columna izquierda - Foto */}
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
            
            {/* Logo InTrucks */}
            <div style={{
            textAlign: 'left',
            marginTop: '20px'
          }}>
              <img src={intrucksLogo} alt="InTrucks Corp" width="140" height="auto" style={{
              height: 'auto',
              width: '140px',
              display: 'inline-block'
            }} />
            </div>
          </td>
          
          {/* Columna derecha - Contenido */}
          <td style={{
          padding: '30px 40px 30px 20px',
          verticalAlign: 'middle'
        }}>
            {/* Nombre */}
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
            
            {/* Cargo */}
            {showPosition && data.position && (
              <p style={{
                fontSize: '16px',
                color: '#5da89c',
                margin: '0 0 15px 0',
                fontWeight: 400
              }}>
                {data.position}
              </p>
            )}
            
            {/* Línea separadora */}
            <div style={{
            height: '2px',
            background: '#5da89c',
            margin: '15px 0 20px 0'
          }}></div>
            
            {/* Información de contacto */}
            <table cellPadding="0" cellSpacing="0" style={{
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#000000',
            marginBottom: '20px'
          }}>
              <tbody>
                <tr>
                  <td style={{
                  padding: '5px 0'
                }}>
                    <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#5da89c',
                    borderRadius: '4px',
                    marginRight: '10px',
                    verticalAlign: 'middle'
                  }}>
                      <Mail size={16} color="#ffffff" strokeWidth={2.5} />
                    </span>
                    <a href={`mailto:${data.email}`} style={{
                    color: '#000000',
                    textDecoration: 'none',
                    verticalAlign: 'middle'
                  }}>
                      {data.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{
                  padding: '5px 0'
                }}>
                    <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#5da89c',
                    borderRadius: '4px',
                    marginRight: '10px',
                    verticalAlign: 'middle'
                  }}>
                      <Phone size={16} color="#ffffff" strokeWidth={2.5} />
                    </span>
                    <span style={{
                    color: '#666666',
                    fontSize: '12px',
                    marginRight: '8px',
                    verticalAlign: 'middle'
                  }}>P:</span>
                    <a href={`tel:${data.phone.replace(/\D/g, '')}`} style={{
                    color: '#000000',
                    textDecoration: 'none',
                    verticalAlign: 'middle',
                    marginRight: '20px'
                  }}>
                      {data.phone}
                    </a>
                    <span style={{
                    color: '#666666',
                    fontSize: '12px',
                    marginRight: '8px',
                    verticalAlign: 'middle'
                  }}>O:</span>
                    <a href={`tel:${data.officePhone.replace(/\D/g, '')}`} style={{
                    color: '#000000',
                    textDecoration: 'none',
                    verticalAlign: 'middle'
                  }}>
                      {data.officePhone}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{
                  padding: '5px 0'
                }}>
                    <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#5da89c',
                    borderRadius: '4px',
                    marginRight: '10px',
                    verticalAlign: 'middle'
                  }}>
                      <Globe size={16} color="#ffffff" strokeWidth={2.5} />
                    </span>
                    <a href="https://www.intruckscorp.com" style={{
                    color: '#000000',
                    textDecoration: 'none',
                    verticalAlign: 'middle'
                  }}>
                      www.intruckscorp.com
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{
                  padding: '5px 0'
                }}>
                    <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#5da89c',
                    borderRadius: '4px',
                    marginRight: '10px',
                    verticalAlign: 'middle'
                  }}>
                      <MapPin size={16} color="#ffffff" strokeWidth={2.5} />
                    </span>
                    <a href="https://www.google.com/maps/search/?api=1&query=6750+N.+Andrews+Ave,+Fort+Lauderdale,+FL+33309" style={{
                    color: '#000000',
                    textDecoration: 'none',
                    verticalAlign: 'middle'
                  }}>
                      6750 N. Andrews Ave, Fort Lauderdale, FL 33309
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            
          </td>
        </tr>
      </tbody>
    </table>;
};
export const SignatureGenerator = () => {
  const [signatureData, setSignatureData] = useState<SignatureData>({
    name: "David Ruiz",
    position: "General Manager",
    phone: "",
    officePhone: "",
    email: "david@intruckscorp.com",
    photo: ""
  });
  const [copied, setCopied] = useState(false);
  const [showPosition, setShowPosition] = useState(false);
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');

    // Limit to 10 digits
    const limitedNumbers = numbers.slice(0, 10);

    // Format as (XXX) XXX-XXXX
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `(${limitedNumbers.slice(0, 3)}) ${limitedNumbers.slice(3)}`;
    } else {
      return `(${limitedNumbers.slice(0, 3)}) ${limitedNumbers.slice(3, 6)}-${limitedNumbers.slice(6)}`;
    }
  };
  const handlePhoneChange = (field: 'phone' | 'officePhone', value: string) => {
    const formatted = formatPhoneNumber(value);
    setSignatureData({
      ...signatureData,
      [field]: formatted
    });
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Solo se permiten imágenes JPG, PNG o WEBP");
        return;
      }

      // Validar tamaño de archivo (máximo 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast.error("La imagen debe ser menor a 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureData({
          ...signatureData,
          photo: reader.result as string
        });
      };
      reader.onerror = () => {
        toast.error("Error al cargar la imagen");
      };
      reader.readAsDataURL(file);
    }
  };
  const generateSignatureHTML = () => {
    // Validar datos antes de generar la firma
    try {
      signatureSchema.parse(signatureData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
        return '';
      }
    }

    // Escapar todos los datos de usuario para prevenir XSS
    const safeName = escapeHtml(signatureData.name);
    const safePosition = escapeHtml(signatureData.position);
    const safeEmail = escapeHtml(signatureData.email);
    const safePhone = escapeHtml(signatureData.phone);
    const safeOfficePhone = escapeHtml(signatureData.officePhone);
    const photoSrc = signatureData.photo || defaultProfile;
    const photoFilter = !signatureData.photo ? 'filter: opacity(0.4);' : '';
    return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; width: 700px; max-width: 700px; background: #ffffff;">
  <tr>
    <!-- Columna izquierda - Foto -->
    <td width="200" style="padding: 30px; vertical-align: middle; text-align: center;">
      <img src="${photoSrc}" alt="${safeName}" width="180" height="180" style="width: 180px; height: 180px; border-radius: 50%; display: block; margin: 0 auto; object-fit: cover; object-position: center; pointer-events: none; cursor: default; ${photoFilter}" />
      
      <!-- Logo InTrucks -->
      <div style="text-align: left; margin-top: 20px;">
        <img src="${intrucksLogo}" alt="InTrucks Corp" width="140" style="height: auto; width: 140px; display: inline-block;" />
      </div>
    </td>
    
    <!-- Columna derecha - Contenido -->
    <td style="padding: 30px 40px 30px 20px; vertical-align: middle;">
      <!-- Nombre -->
      <h2 style="font-size: 32px; font-weight: 700; color: #000000; margin: 0 0 8px 0; line-height: 1.2; text-transform: uppercase; letter-spacing: 2px;">
        ${safeName}
      </h2>
      
      <!-- Cargo -->
      ${showPosition && signatureData.position ? `<p style="font-size: 16px; color: #5da89c; margin: 0 0 15px 0; font-weight: 400;">
        ${safePosition}
      </p>` : ''}
      
      <!-- Línea separadora -->
      <div style="height: 2px; background: #5da89c; margin: 15px 0 20px 0;"></div>
      
      <!-- Información de contacto -->
      <table cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.8; color: #000000; margin-bottom: 20px;">
        <tr>
          <td style="padding: 5px 0;">
            <span style="display: inline-block; width: 30px; height: 30px; background-color: #5da89c; border-radius: 4px; text-align: center; line-height: 30px; margin-right: 10px; vertical-align: middle;">
              <span style="color: #ffffff; font-size: 16px; font-weight: bold;">✉</span>
            </span>
            <a href="mailto:${safeEmail}" style="color: #000000; text-decoration: none; vertical-align: middle;">
              ${safeEmail}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 0;">
            <span style="display: inline-block; width: 30px; height: 30px; background-color: #5da89c; border-radius: 4px; text-align: center; line-height: 30px; margin-right: 10px; vertical-align: middle;">
              <span style="color: #ffffff; font-size: 16px; font-weight: bold;">☎</span>
            </span>
            <span style="color: #666666; font-size: 12px; margin-right: 8px; vertical-align: middle;">Personal:</span>
            <a href="tel:${signatureData.phone.replace(/\D/g, '')}" style="color: #000000; text-decoration: none; vertical-align: middle; margin-right: 20px;">
              ${safePhone}
            </a>
            <span style="color: #666666; font-size: 12px; margin-right: 8px; vertical-align: middle;">Oficina:</span>
            <a href="tel:${signatureData.officePhone.replace(/\D/g, '')}" style="color: #000000; text-decoration: none; vertical-align: middle;">
              ${safeOfficePhone}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 0;">
            <span style="display: inline-block; width: 30px; height: 30px; background-color: #5da89c; border-radius: 4px; text-align: center; line-height: 30px; margin-right: 10px; vertical-align: middle;">
              <span style="color: #ffffff; font-size: 16px; font-weight: bold;">🌐</span>
            </span>
            <a href="https://www.intruckscorp.com" style="color: #000000; text-decoration: none; vertical-align: middle;">
              www.intruckscorp.com
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 0;">
            <span style="display: inline-block; width: 30px; height: 30px; background-color: #5da89c; border-radius: 4px; text-align: center; line-height: 30px; margin-right: 10px; vertical-align: middle;">
              <span style="color: #ffffff; font-size: 16px; font-weight: bold;">📍</span>
            </span>
            <a href="https://www.google.com/maps/search/?api=1&query=6750+N.+Andrews+Ave,+Fort+Lauderdale,+FL+33309" style="color: #000000; text-decoration: none; vertical-align: middle;">
              6750 N. Andrews Ave, Fort Lauderdale, FL 33309
            </a>
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
      await navigator.clipboard.write([new ClipboardItem({
        "text/html": new Blob([html], {
          type: "text/html"
        }),
        "text/plain": new Blob([html], {
          type: "text/plain"
        })
      })]);
      setCopied(true);
      toast.success("Firma copiada al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Error al copiar la firma");
    }
  };
  return <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">Generador de firmas In Trucks</h1>
        <p className="text-muted-foreground">No es dar el paso sino dejar la huella </p>
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
                    {signatureData.photo ? <img src={signatureData.photo} alt="Preview" className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-secondary" /> : <div className="flex flex-col items-center gap-2">
                        <Upload className="w-12 h-12 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Haz clic para subir una foto
                        </span>
                      </div>}
                  </div>
                  <Input id="photo" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" value={signatureData.name} onChange={e => {
              const value = e.target.value;
              if (value.length <= 100) {
                setSignatureData({
                  ...signatureData,
                  name: value
                });
              }
            }} placeholder="Ej: David Ruiz" maxLength={100} />
              <p className="text-xs text-muted-foreground mt-1">
                {signatureData.name.length}/100 caracteres
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox 
                  id="show-position" 
                  checked={showPosition}
                  onCheckedChange={(checked) => setShowPosition(checked as boolean)}
                />
                <Label htmlFor="show-position" className="cursor-pointer">
                  Mostrar cargo en la firma
                </Label>
              </div>
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                value={signatureData.position}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 100) {
                    setSignatureData({ ...signatureData, position: value });
                  }
                }}
                placeholder="Ej: General Manager"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {signatureData.position.length}/100 caracteres
              </p>
            </div>

            <div>
              <Label htmlFor="phone">Teléfono personal</Label>
              <Input id="phone" value={signatureData.phone} onChange={e => handlePhoneChange('phone', e.target.value)} placeholder="Ej: (000) 000-0000" />
            </div>

            <div>
              <Label htmlFor="officePhone">Teléfono Oficina</Label>
              <Input id="officePhone" value={signatureData.officePhone} onChange={e => handlePhoneChange('officePhone', e.target.value)} placeholder="Ej: (000) 000-0000" />
            </div>

            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" value={signatureData.email} onChange={e => {
              const value = e.target.value;
              if (value.length <= 255) {
                setSignatureData({
                  ...signatureData,
                  email: value
                });
              }
            }} placeholder="Ej: david@intruckscorp.com" maxLength={255} />
              <p className="text-xs text-muted-foreground mt-1">
                Debe ser un correo @intruckscorp.com
              </p>
            </div>

            <Button onClick={copyToClipboard} className="w-full" size="lg">
              {copied ? <>
                  <Check className="w-4 h-4 mr-2" />
                  ¡Copiado!
                </> : <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Firma para Correo
                </>}
            </Button>
          </div>
        </Card>

        {/* Preview Panel */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Vista Previa</h2>
          <div className="bg-muted/30 rounded-lg p-4 overflow-auto">
            <SignaturePreview data={signatureData} showPosition={showPosition} />
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
    </div>;
};