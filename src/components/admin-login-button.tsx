
'use client';

import { useAdminLogin } from './admin-login-modal-provider';
import { Button } from './ui/button';

export function AdminLoginButton() {
    const { openAdminLogin } = useAdminLogin();

    return (
        <button
            onClick={openAdminLogin}
            className="text-xs text-muted-foreground hover:underline"
        >
            Acesso Admin
        </button>
    )
}
