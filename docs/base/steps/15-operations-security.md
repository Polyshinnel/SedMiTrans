# Шаг 15. Настроить эксплуатацию, backup и hardening

## Цель

Сделать production восстанавливаемым и наблюдаемым: шифрованные внешние backups, restore drills, alerts, безопасные headers/cookies/forms и документированные incident runbooks.

## Зависимости

- Production deployment выполнен на шаге 14.
- Retention/SLA/ПДн требования утверждены на шаге 01.

## Backup и restore

Создать `docs/BackupRestore.md` с исполняемыми командами и ответственными.

1. MySQL backup ежедневно:
   - consistent dump либо physical backup, подходящий размеру базы;
   - шифрование до внешней передачи;
   - off-host/object storage;
   - retention tiers из требований;
   - checksum и уведомление о результате.
2. `storage_public` backup отдельно; Redis AOF не считать backup бизнес-данных.
3. Секрет шифрования backup хранить отдельно от Docker host и backup files.
4. Не копировать live MySQL volume filesystem обычным архиватором без корректной DB-aware процедуры.
5. Ежемесячно восстанавливать DB и media в изолированное окружение, выполнять migrations при необходимости и smoke test.
6. Фиксировать фактические RPO/RTO, объём, длительность, checksum и результат восстановления.

Пример логики dump (конкретные secret injection и object storage CLI выбрать в инфраструктуре):

```bash
mysqldump --single-transaction --quick --routines --triggers \
  --host=mysql --user="$DB_USERNAME" --password="$DB_PASSWORD" "$DB_DATABASE" \
  | gzip \
  | age -r "$BACKUP_AGE_RECIPIENT" \
  > "sedmitrans-${BACKUP_TIMESTAMP}.sql.gz.age"
```

Не помещать реальную команду с inline password в cron/logs. Скрипт должен использовать secret mechanism и `set -o pipefail`, проверять exit status каждого этапа и upload checksum.

## Monitoring и alerts

Настроить alerts минимум на:

- внешний HTTPS `/` и backend readiness;
- `5xx` rate/latency;
- Horizon queue wait, failed jobs, остановку workers;
- scheduler heartbeat;
- container restart loop/memory pressure;
- MySQL/Redis availability и capacity;
- disk/inode usage volumes/host;
- возраст последнего успешного backup;
- срок TLS certificate.

Для каждого alert в runbook указать severity, порог, дежурного, первые диагностические команды и условие эскалации.

## Logging и correlation

- stdout/stderr либо централизованный collector, с rotation;
- structured JSON в production, если поддерживается stack;
- request ID от Nginx до Laravel response и job context;
- redaction password/token/cookie/authorization и полей ПДн;
- не логировать body публичной формы и содержимое файлов;
- retention логов соответствует политике ПДн.

## Security hardening

1. Rate limit mutating public endpoints; honeypot/CAPTCHA включать по фактической атакуемости и accessibility review.
2. Проверить CSRF/auth model из ADR-0002 и same-origin cookies.
3. Headers:
   - `X-Content-Type-Options: nosniff`;
   - `Referrer-Policy`;
   - CSP сначала report-only, затем enforce после инвентаризации Next/Filament assets;
   - HSTS только после проверки всех HTTPS subdomains и осознанного решения `includeSubDomains`.
4. Secure/HttpOnly/SameSite cookies, rotation sessions после login/privilege change.
5. Upload validation и private/public separation из шага 07 регулярно тестируются.
6. MySQL/Redis/FPM/Node не доступны из Internet; firewall/platform routes проверены извне.
7. Обновления Composer/NPM/base images идут отдельными reviewed PR с CI, changelog/security review и staging smoke.
8. Выполнить secret scan repository, image layers и frontend bundle. При найденном секрете недостаточно удалить файл — secret немедленно ротировать.

## Load и failure drills

- короткий нагрузочный тест публичной страницы/формы в пределах согласованного SLA;
- остановка Redis: приложение отдаёт контролируемую ошибку, после восстановления queue продолжает работу;
- restart Horizon во время job: side effect не дублируется;
- временная недоступность MySQL: readiness падает, liveness процесса остаётся диагностируемым;
- заполнение media/disk threshold проверяет alert до полного отказа;
- rollback и restore выполняются по документации другим исполнителем, не автором runbook.

## Итоговая проверка секретов и данных

Проверить Git tracked files, Docker history/config, CI logs/artifacts, Next static bundle/source maps, application logs и backups metadata. Зафиксировать только факт проверки и найденные типы проблем; не копировать secret values в отчёт.

## Критерии приёмки

- Есть свежие зашифрованные off-host backups MySQL и media.
- Restore drill успешно поднял изолированную копию и прошёл smoke; RPO/RTO измерены.
- Все обязательные alerts тестово срабатывают и имеют runbooks.
- ПДн/credentials не попадают в application/access/CI logs.
- Security headers/cookies/rate limits проверены реальными HTTP responses.
- Dependency/image update cadence и ответственные закреплены.
- Финальный checklist из `docs/base/steps/README.md` выполнен полностью.
