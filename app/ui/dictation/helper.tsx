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
        const searchHelper = async () => {
          try {
            const wordErrorMaj = wordError.toUpperCase()
            console.log(process.env.NEXT_PUBLIC_BASE_URL + `/api/helpers?query=${wordErrorMaj}`)
            const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + `/api/helpers?query=${wordErrorMaj}`);

            const helper: HelperData = response.data[0].helper;
            setHelperData(helper);
            setIsLoading(false)
            setError(null);
          } catch (error) {
            setIsLoading(false);
            if (error instanceof Error) {
              setError(error); // Définir l'état d'erreur avec l'objet d'erreur complet
            } 
          }
        };
    
        if (wordError) {
          searchHelper();
        }
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
