import { v4 as uuidv4 } from "uuid";
import { IProduct } from "../models/IProduct";

export const products: IProduct[] = [
  {
    id: uuidv4(),
    name: "Café Orgánico de Altura",
    description:
      "Café cultivado en zonas altas con un sabor intenso y aroma floral.",
    price: 12.5,
    category: "Bebidas",
  },
  {
    id: uuidv4(),
    name: "Cuadro Pintado a Mano",
    description:
      "Obra única realizada por artista local en lienzo de alta calidad.",
    price: 45.0,
    category: "Arte",
  },
  {
    id: uuidv4(),
    name: "Jabón Artesanal de Lavanda",
    description:
      "Elaborado con ingredientes naturales, ideal para pieles sensibles.",
    price: 6.75,
    category: "Cuidado Personal",
  },
  {
    id: uuidv4(),
    name: "Miel Pura de Abeja",
    description:
      "Miel cosechada de colmenas naturales sin aditivos ni conservantes.",
    price: 9.9,
    category: "Alimentos",
  },
  {
    id: uuidv4(),
    name: "Pulsera de Cuero Trenzado",
    description: "Accesorio artesanal hecho a mano con cierre metálico.",
    price: 15.0,
    category: "Accesorios",
  },
  
];
