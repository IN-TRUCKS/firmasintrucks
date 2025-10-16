import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import intrucksLogo from "@/assets/intrucks-logo.png";

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
  name: z.string()
    .trim()
    .min(1, { message: "El nombre es requerido" })
    .max(100, { message: "El nombre debe tener menos de 100 caracteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, { message: "El nombre contiene caracteres no válidos" }),
  position: z.string()
    .trim()
    .min(1, { message: "El cargo es requerido" })
    .max(100, { message: "El cargo debe tener menos de 100 caracteres" }),
  phone: z.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, { message: "Formato de teléfono inválido. Debe ser (XXX) XXX-XXXX" }),
  officePhone: z.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, { message: "Formato de teléfono inválido. Debe ser (XXX) XXX-XXXX" }),
  email: z.string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "El email debe tener menos de 255 caracteres" })
    .regex(/@intruckscorp\.com$/, { message: "Solo se permiten correos @intruckscorp.com" }),
  photo: z.string().max(5000000, { message: "La imagen es demasiado grande" }), // ~5MB en base64
});

// Función para escapar HTML - solo se usa para generar el HTML que se copia al clipboard
const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
};

// Componente seguro de preview - renderiza usando JSX sin dangerouslySetInnerHTML
const SignaturePreview = ({ data }: { data: SignatureData }) => {
  const photoSrc = data.photo || 'https://via.placeholder.com/140';
  
  return (
    <table 
      cellPadding="0" 
      cellSpacing="0" 
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        width: '100%',
        maxWidth: '600px',
        background: '#ffffff',
        position: 'relative'
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: '0', position: 'relative' }}>
            {/* Franja diagonal izquierda verde-azul */}
            <div style={{
              position: 'absolute',
              left: '0',
              top: '0',
              bottom: '0',
              width: '108px',
              background: 'linear-gradient(135deg, #1a3d6d 0%, #5da89c 100%)',
              clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0 100%)',
              zIndex: 0
            }}></div>
            
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
              <tbody>
                <tr>
                  <td style={{ 
                    padding: '18px 25px 18px 120px'
                  }}>
                    <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          {/* Logo en la esquina superior derecha */}
                          <td colSpan={3} style={{ paddingBottom: '12px', textAlign: 'right' }}>
                            <img src={intrucksLogo} alt="InTrucks Corp" style={{ height: '30px', display: 'inline-block' }} />
                          </td>
                        </tr>
                        <tr>
                          {/* Foto con borde verde - posicionada sobre la franja */}
                          <td style={{ paddingRight: '20px', verticalAlign: 'top', width: '84px', position: 'relative' }}>
                            <div style={{ 
                              width: '78px', 
                              height: '78px', 
                              borderRadius: '50%',
                              border: '3px solid #5da89c',
                              overflow: 'hidden',
                              boxShadow: '0 4px 12px rgba(93, 168, 156, 0.4)',
                              position: 'relative',
                              left: '-84px',
                              background: '#ffffff'
                            }}>
                              <img 
                                src={photoSrc} 
                                alt={data.name} 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover',
                                  display: 'block'
                                }} 
                              />
                            </div>
                          </td>
                          
                          {/* Información principal */}
                          <td style={{ verticalAlign: 'top', paddingRight: '25px', width: '50%' }}>
                            <div>
                              <h2 style={{ 
                                fontSize: '19px', 
                                fontWeight: 700, 
                                color: '#5da89c', 
                                margin: '0 0 4px 0',
                                lineHeight: '1.2'
                              }}>
                                {data.name}
                              </h2>
                              <p style={{ 
                                fontSize: '10px', 
                                color: '#2c3e50', 
                                margin: '0 0 12px 0',
                                fontWeight: 500
                              }}>
                                {data.position}
                              </p>
                            </div>
                            
                            {/* Contacto con iconos */}
                            <div style={{ fontSize: '8.5px', lineHeight: '1.8', color: '#2c3e50' }}>
                              <div style={{ marginBottom: '2px' }}>
                                <span style={{ display: 'inline-block', width: '13px', color: '#5da89c', fontSize: '8px' }}>📱</span>
                                <span style={{ fontWeight: 600, marginRight: '4px' }}>O</span>
                                <a href={`tel:${data.phone.replace(/\D/g, '')}`} style={{ color: '#2c3e50', textDecoration: 'none' }}>
                                  {data.phone}
                                </a>
                              </div>
                              <div style={{ marginBottom: '2px' }}>
                                <span style={{ display: 'inline-block', width: '13px', color: '#5da89c', fontSize: '8px' }}>📞</span>
                                <span style={{ fontWeight: 600, marginRight: '4px' }}>P</span>
                                <a href={`tel:${data.officePhone.replace(/\D/g, '')}`} style={{ color: '#2c3e50', textDecoration: 'none' }}>
                                  {data.officePhone}
                                </a>
                              </div>
                              <div style={{ marginBottom: '2px' }}>
                                <span style={{ display: 'inline-block', width: '13px', color: '#5da89c', fontSize: '8px' }}>✉️</span>
                                <a href={`mailto:${data.email}`} style={{ color: '#1a3d6d', textDecoration: 'none', fontWeight: 500 }}>
                                  {data.email}
                                </a>
                              </div>
                            </div>
                          </td>
                          
                          {/* Columna derecha - Website y dirección */}
                          <td style={{ verticalAlign: 'top', paddingRight: '15px', width: '35%' }}>
                            <div style={{ fontSize: '8.5px', lineHeight: '1.8', color: '#2c3e50' }}>
                              <div style={{ marginBottom: '3px', paddingBottom: '8px', borderBottom: '1px solid #5da89c' }}>
                                <span style={{ display: 'inline-block', width: '13px', color: '#5da89c', fontSize: '8px' }}>🌐</span>
                                <a href="https://www.intruckscorp.com" style={{ color: '#1a3d6d', textDecoration: 'none', fontWeight: 500 }}>
                                  www.intruckscorp.com
                                </a>
                              </div>
                              <div style={{ fontSize: '8px', color: '#666', marginTop: '8px' }}>
                                <span style={{ display: 'inline-block', width: '13px', color: '#5da89c', fontSize: '8px', verticalAlign: 'top' }}>📍</span>
                                <span style={{ lineHeight: '1.5', display: 'inline-block', width: 'calc(100% - 13px)' }}>
                                  6750 N. Andrews Ave, Suite 200 Fort Lauderdale, FL 33309
                                </span>
                              </div>
                            </div>
                            
                            {/* License info */}
                            <div style={{ marginTop: '10px', fontSize: '6px', color: '#888', lineHeight: '1.4' }}>
                              <div style={{ fontWeight: 700, color: '#666' }}>IN TRUCKS INSURANCE CORP</div>
                              <div>IN CALIFORNIA DBA IN TRUCKS</div>
                              <div>INSURANCE SOLUTIONS</div>
                              <div>LICENSE # 6006644</div>
                            </div>
                          </td>
                          
                          {/* Barra vertical decorativa */}
                          <td style={{ 
                            width: '5px', 
                            background: 'linear-gradient(180deg, #1a3d6d 0%, #5da89c 100%)',
                            verticalAlign: 'top',
                            borderRadius: '2px'
                          }}></td>
                        </tr>
                      </tbody>
                    </table>
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
  const [signatureData, setSignatureData] = useState<SignatureData>({
    name: "David Ruiz",
    position: "General Manager",
    phone: "",
    officePhone: "",
    email: "david@intruckscorp.com",
    photo: "",
  });

  const [copied, setCopied] = useState(false);

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
    setSignatureData({ ...signatureData, [field]: formatted });
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
        setSignatureData({ ...signatureData, photo: reader.result as string });
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
    const photoSrc = signatureData.photo || 'https://via.placeholder.com/140';
    
    return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; width: 100%; max-width: 600px; background: #ffffff; position: relative;">
  <tr>
    <td style="padding: 0; position: relative;">
      <!-- Franja diagonal izquierda verde-azul -->
      <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 108px; background: linear-gradient(135deg, #1a3d6d 0%, #5da89c 100%); clip-path: polygon(0 0, 100% 0, 70% 100%, 0 100%); z-index: 0;"></div>
      
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="position: relative; z-index: 1;">
        <tr>
          <td style="padding: 18px 25px 18px 120px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <!-- Logo en la esquina superior derecha -->
                <td colspan="4" style="padding-bottom: 12px; text-align: right;">
                  <img src="${intrucksLogo}" alt="InTrucks Corp" style="height: 30px; display: inline-block;" />
                </td>
              </tr>
              <tr>
                <!-- Foto con borde verde - posicionada sobre la franja -->
                <td style="padding-right: 20px; vertical-align: top; width: 84px; position: relative;">
                  <div style="width: 78px; height: 78px; border-radius: 50%; border: 3px solid #5da89c; overflow: hidden; box-shadow: 0 4px 12px rgba(93, 168, 156, 0.4); position: relative; left: -84px; background: #ffffff;">
                    <img src="${photoSrc}" alt="${safeName}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                  </div>
                </td>
                
                <!-- Información principal -->
                <td style="vertical-align: top; padding-right: 25px; width: 50%;">
                  <div>
                    <h2 style="font-size: 19px; font-weight: 700; color: #5da89c; margin: 0 0 4px 0; line-height: 1.2;">
                      ${safeName}
                    </h2>
                    <p style="font-size: 10px; color: #2c3e50; margin: 0 0 12px 0; font-weight: 500;">
                      ${safePosition}
                    </p>
                  </div>
                  
                  <!-- Contacto con iconos -->
                  <div style="font-size: 8.5px; line-height: 1.8; color: #2c3e50;">
                    <div style="margin-bottom: 2px;">
                      <span style="display: inline-block; width: 13px; color: #5da89c; font-size: 8px;">📱</span>
                      <span style="font-weight: 600; margin-right: 4px;">O</span>
                      <a href="tel:${signatureData.phone.replace(/\D/g, '')}" style="color: #2c3e50; text-decoration: none;">
                        ${safePhone}
                      </a>
                    </div>
                    <div style="margin-bottom: 2px;">
                      <span style="display: inline-block; width: 13px; color: #5da89c; font-size: 8px;">📞</span>
                      <span style="font-weight: 600; margin-right: 4px;">P</span>
                      <a href="tel:${signatureData.officePhone.replace(/\D/g, '')}" style="color: #2c3e50; text-decoration: none;">
                        ${safeOfficePhone}
                      </a>
                    </div>
                    <div style="margin-bottom: 2px;">
                      <span style="display: inline-block; width: 13px; color: #5da89c; font-size: 8px;">✉️</span>
                      <a href="mailto:${safeEmail}" style="color: #1a3d6d; text-decoration: none; font-weight: 500;">
                        ${safeEmail}
                      </a>
                    </div>
                  </div>
                </td>
                
                <!-- Columna derecha - Website y dirección -->
                <td style="vertical-align: top; padding-right: 15px; width: 35%;">
                  <div style="font-size: 8.5px; line-height: 1.8; color: #2c3e50;">
                    <div style="margin-bottom: 3px; padding-bottom: 8px; border-bottom: 1px solid #5da89c;">
                      <span style="display: inline-block; width: 13px; color: #5da89c; font-size: 8px;">🌐</span>
                      <a href="https://www.intruckscorp.com" style="color: #1a3d6d; text-decoration: none; font-weight: 500;">
                        www.intruckscorp.com
                      </a>
                    </div>
                    <div style="font-size: 8px; color: #666; margin-top: 8px;">
                      <span style="display: inline-block; width: 13px; color: #5da89c; font-size: 8px; vertical-align: top;">📍</span>
                      <span style="line-height: 1.5; display: inline-block; width: calc(100% - 13px);">
                        6750 N. Andrews Ave, Suite 200 Fort Lauderdale, FL 33309
                      </span>
                    </div>
                  </div>
                  
                  <!-- License info -->
                  <div style="margin-top: 10px; font-size: 6px; color: #888; line-height: 1.4;">
                    <div style="font-weight: 700; color: #666;">IN TRUCKS INSURANCE CORP</div>
                    <div>IN CALIFORNIA DBA IN TRUCKS</div>
                    <div>INSURANCE SOLUTIONS</div>
                    <div>LICENSE # 6006644</div>
                  </div>
                </td>
                
                <!-- Barra vertical decorativa -->
                <td style="width: 5px; background: linear-gradient(180deg, #1a3d6d 0%, #5da89c 100%); vertical-align: top; border-radius: 2px;"></td>
              </tr>
            </table>
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 100) {
                    setSignatureData({ ...signatureData, name: value });
                  }
                }}
                placeholder="Ej: David Ruiz"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {signatureData.name.length}/100 caracteres
              </p>
            </div>

            <div>
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
              <Label htmlFor="phone">Teléfono Móvil</Label>
              <Input
                id="phone"
                value={signatureData.phone}
                onChange={(e) => handlePhoneChange('phone', e.target.value)}
                placeholder="Ej: (000) 000-0000"
              />
            </div>

            <div>
              <Label htmlFor="officePhone">Teléfono Oficina</Label>
              <Input
                id="officePhone"
                value={signatureData.officePhone}
                onChange={(e) => handlePhoneChange('officePhone', e.target.value)}
                placeholder="Ej: (000) 000-0000"
              />
            </div>

            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={signatureData.email}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 255) {
                    setSignatureData({ ...signatureData, email: value });
                  }
                }}
                placeholder="Ej: david@intruckscorp.com"
                maxLength={255}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Debe ser un correo @intruckscorp.com
              </p>
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
            <SignaturePreview data={signatureData} />
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
