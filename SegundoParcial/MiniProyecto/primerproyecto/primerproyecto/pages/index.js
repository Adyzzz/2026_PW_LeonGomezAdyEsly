import link from "next/link";

export default function Home (){
    return (
        <main>
            <h1>Esto es un ejemplo de Página principal con Next</h1>
            <p>
                <link href="/practica/1">Ir a la practica 1</link>
            </p>
        </main>
    );
}