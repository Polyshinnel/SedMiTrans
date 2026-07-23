<?php

namespace App\Console\Commands;

use App\Infrastructure\Persistence\Eloquent\Models\IdentityRoleRecord;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

final class CreateAdmin extends Command
{
    protected $signature = 'identity:create-admin';
    protected $description = 'Создать активного администратора без передачи пароля через CLI';

    public function handle(): int
    {
        $name = (string) $this->ask('Имя'); $email = (string) $this->ask('E-mail');
        $password = (string) $this->secret('Пароль'); $confirmation = (string) $this->secret('Повторите пароль');
        $validator = Validator::make(['name' => $name, 'email' => $email, 'password' => $password, 'password_confirmation' => $confirmation], [
            'name' => ['required', 'string', 'max:255'], 'email' => ['required', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(12)->mixedCase()->numbers()->symbols()],
        ]);
        if ($validator->fails()) { foreach ($validator->errors()->all() as $error) $this->error($error); return self::FAILURE; }
        $user = User::query()->create(['name' => $name, 'email' => $email, 'password' => Hash::make($password), 'is_active' => true]);
        $user->roles()->attach(IdentityRoleRecord::query()->where('name', 'super-admin')->firstOrFail());
        $this->info("Администратор {$user->email} создан."); return self::SUCCESS;
    }
}
