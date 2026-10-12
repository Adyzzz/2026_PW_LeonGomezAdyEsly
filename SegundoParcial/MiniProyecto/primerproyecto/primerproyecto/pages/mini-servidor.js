import { useEffect, useState } from "react";

// vamos a crar un miniservidor a base de express con react

export default function MiniServidor(){
    const [saludo, setSaludo] = useState('');
    const[text, setTexto] = useState('');
    const [eco, setEco] = useState('');
    const [error, setError] = useState('');

    useEffect(() =>{
        fetch('/mini/saludo')
        .then((res) => res.json())
        .then((data) => setSaludo(data.mesaje))
        .catch(() => setError('l mini servidor no responde, arrancalo en el puerto 4000')); 
    }, []);

    async function EnviarEco (e) {
        e.preventDefault();
        setError('');
        const res = await fetch ('/mini/eco', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify({text})
        })
        const data = await res.json();
        if(res.ok){
            setEco(data.eso);
            setTexto('');
        }else{
            DynamicServerError(`Error: ${data.error}`);
        }
    }

    return(
        <main>
            <h1>Mini Servidro Express</h1>
            <h2>GET /saludo</h2>
            <p>{saludo}</p>

            <h2>POST /eco</h2>

            <form onSumbit={EnviarEco} className="formulario">
                <input placeholder="Texto" value={text} onChange= {(e)=>setTexto(e.target.value)}></input>
                <button type="sumbit">Enviar</button>
            </form>
            {eco && <p>El servidor respondio: {eco} </p>}
            {error && <p className="error"> {error} </p>}
        </main>
    );
}