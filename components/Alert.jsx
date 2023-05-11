'use client'

import { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';

import { alertService } from '../services/alert.service';

export { Alert };

function Alert() {
    const router = useRouter();
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        // subscribe to new alert notifications
        const subscription = alertService.alert.subscribe(alert => setAlert(alert));

        // unsubscribe when the component unmounts
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        // clear alert on location change
        alertService.clear();
    }, [router]);

    if (!alert) return null;

    return (
        <div className="container">
            <div className="m-3">
                <div className={`flex justify-between rounded text-white px-6 py-4 alert alert-dismissable ${alert.type}`}>
                    {alert.message}
                    <button type="button" className="close" onClick={() => alertService.clear()}>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
