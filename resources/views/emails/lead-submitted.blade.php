<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
</head>
<body style="margin:0; padding:0; background-color:#f8f8f7; color:#4f4943; font-family:Arial, Helvetica, sans-serif;">
<div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    {{ $subject }} — sedmitrans.ru
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; background-color:#f8f8f7;">
    <tr>
        <td align="center" style="padding:32px 16px;">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; background-color:#ffffff;">
                <tr>
                    <td style="padding:20px 32px; background-color:#4f4943; border-bottom:4px solid #ff7c1f;">
                        <a href="{{ rtrim((string) config('app.url'), '/') }}" style="display:inline-block; text-decoration:none;">
                            <img src="{{ $logoUrl }}" width="142" alt="SedMiTrans" style="display:block; width:142px; height:auto; border:0;">
                        </a>
                    </td>
                </tr>
                <tr>
                    <td style="padding:36px 32px 20px;">
                        <p style="margin:0 0 10px; color:#ff7c1f; font-size:12px; font-weight:bold; letter-spacing:1.5px; text-transform:uppercase;">
                            {{ $lead->type === 'quote' ? 'Запрос расчёта' : 'Обратная связь' }}
                        </p>
                        <h1 style="margin:0; color:#4f4943; font-size:28px; line-height:1.2; font-weight:700;">
                            {{ $subject }}
                        </h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:0 32px 32px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; border:1px solid #eeecea;">
                            <tr>
                                <td width="38%" style="padding:13px 16px; border-bottom:1px solid #eeecea; color:#827a73; font-size:14px;">Имя</td>
                                <td style="padding:13px 16px; border-bottom:1px solid #eeecea; color:#4f4943; font-size:14px; font-weight:bold;">{{ $lead->name }}</td>
                            </tr>
                            <tr>
                                <td style="padding:13px 16px; border-bottom:1px solid #eeecea; color:#827a73; font-size:14px;">Телефон</td>
                                <td style="padding:13px 16px; border-bottom:1px solid #eeecea; color:#4f4943; font-size:14px; font-weight:bold;"><a href="tel:{{ $lead->phone }}" style="color:#4f4943;">{{ $lead->phone }}</a></td>
                            </tr>
                            <tr>
                                <td style="padding:13px 16px;{{ $lead->type === 'quote' || $lead->email ? ' border-bottom:1px solid #eeecea;' : '' }} color:#827a73; font-size:14px;">Email</td>
                                <td style="padding:13px 16px;{{ $lead->type === 'quote' || $lead->email ? ' border-bottom:1px solid #eeecea;' : '' }} color:#4f4943; font-size:14px;">@if($lead->email)<a href="mailto:{{ $lead->email }}" style="color:#ff7c1f;">{{ $lead->email }}</a>@else—@endif</td>
                            </tr>
                            @if($lead->type === 'quote')
                                <tr>
                                    <td style="padding:13px 16px; border-bottom:1px solid #eeecea; color:#827a73; font-size:14px;">Груз</td>
                                    <td style="padding:13px 16px; border-bottom:1px solid #eeecea; color:#4f4943; font-size:14px;">{{ $lead->cargo ?: '—' }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:13px 16px; border-bottom:1px solid #eeecea; color:#827a73; font-size:14px;">Маршрут</td>
                                    <td style="padding:13px 16px; border-bottom:1px solid #eeecea; color:#4f4943; font-size:14px;">{{ $lead->route ?: '—' }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:13px 16px; color:#827a73; font-size:14px;">Параметры груза</td>
                                    <td style="padding:13px 16px; color:#4f4943; font-size:14px;">{{ $lead->cargo_parameters ?: '—' }}</td>
                                </tr>
                            @else
                                <tr>
                                    <td style="padding:13px 16px; color:#827a73; font-size:14px; vertical-align:top;">Сообщение</td>
                                    <td style="padding:13px 16px; color:#4f4943; font-size:14px; white-space:pre-line;">{{ $lead->message ?: '—' }}</td>
                                </tr>
                            @endif
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 32px; background-color:#4f4943; color:#d9d6d2; font-size:12px; line-height:1.5;">
                        Это автоматическое уведомление с сайта <a href="{{ rtrim((string) config('app.url'), '/') }}" style="color:#ff7c1f; text-decoration:none;">sedmitrans.ru</a>.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
