import './Helper.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDictationContext } from './dictation';

interface HelperData {
  title: string;
  description: { text: string }[] | null;
}

interface HelperProps {
    typeError: string;
  }

export default function Helper({ typeError }: HelperProps) {
    const { state } = useDictationContext();
    const [helperData, setHelperData] = useState<HelperData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {

        setHelperData(null);
        if (state.currentWordToGuess && typeError == "Word") {
            setIsLoading(true);
            axios.get(process.env.NEXT_PUBLIC_BASE_URL + `/api/helpers?query=${state.currentWordToGuess}`)
                .then(response => {
                    setHelperData(response.data[0].helper);
                    setIsLoading(false)
                    setError(null);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération de l’aide', error);
                    setError(error);
                    setIsLoading(false);
                });
        }
        if(typeError == "Majuscule"){
            const newData = {
                title: 'Attention aux majuscules',
                description: null,
              };
              
              setHelperData((prevData) => ({
                ...prevData,
                ...newData,
              }));

        }
        if(typeError == "Ponctuation"){
            const newData = {
                title: 'Attention aux ponctuations',
                description: null,
              };
              
              setHelperData((prevData) => ({
                ...prevData,
                ...newData,
              }));

        }
    }, [state.currentWordToGuess, typeError]);
    
    // Rendu conditionnel en fonction des étatss/
    if (isLoading) {
        if (error) {
            return <p>Erreur lors du chargement de l&apos;aide.</p>;
        }
        return <p>Chargement de l&apos;aide...</p>;
    }
    else if (helperData && state.isTyping == false) {
        return (
                <div className="helper-bubble">
                    <h3>{helperData.title}</h3>
                    {
                        helperData.description && Array.isArray(helperData.description) && (
                            <ul>
                                {helperData.description.map((description, index) => (
                                    <li key={index}>
                                        <section
                                            className="not-found-controller"
                                            dangerouslySetInnerHTML={{ __html: description.text }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )
                    }
                </div>
        )
    };
}
