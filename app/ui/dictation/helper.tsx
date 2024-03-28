import './Helper.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface HelperData {
  title: string;
  description: { text: string }[];
}

export default function Helper({ wordError }: { wordError: string}) {
    const [helperData, setHelperData] = useState<HelperData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (wordError) {
            axios.get(process.env.NEXT_PUBLIC_BASE_URL + `/api/helpers?query=${wordError}`)
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
        };
    }, [wordError]);
    
    if(helperData)[
        console.log("helper : " + helperData.description)  
    ]
    
    // Rendu conditionnel en fonction des états
    if (isLoading) {
        if (error) {
            return <p>Erreur lors du chargement de l&apos;aide.</p>;
        }
        return <p>Chargement de l&apos;aide...</p>;
    }
    else if (helperData) {
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
