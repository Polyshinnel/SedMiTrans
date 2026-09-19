<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_pages', function (Blueprint $table): void {
            $table->id();
            $table->string('key')->unique();
            $table->string('name');
            $table->string('path');
            $table->string('title', 255);
            $table->text('description');
            $table->timestamps();
        });

        $now = now();

        DB::table('seo_pages')->insert([
            ['key' => 'home', 'name' => 'Главная', 'path' => '/', 'title' => 'Грузовые перевозки по России и миру — SedMiTrans', 'description' => 'Организуем автомобильные, железнодорожные, авиационные и мультимодальные перевозки грузов по России и международным направлениям.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'services', 'name' => 'Услуги', 'path' => '/uslugi', 'title' => 'Логистические услуги и грузовые перевозки — SedMiTrans', 'description' => 'Подбираем транспорт и маршрут под задачу: автоперевозки, железнодорожная и авиадоставка, спецгрузы, таможня и складская логистика.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'about', 'name' => 'О компании', 'path' => '/about', 'title' => 'О компании SedMiTrans — логистика под контролем', 'description' => 'Команда SedMiTrans организует сложные перевозки, сопровождает груз на каждом этапе и помогает бизнесу двигаться без лишних рисков.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'cases', 'name' => 'Кейсы', 'path' => '/kejsy', 'title' => 'Кейсы SedMiTrans — реальные логистические решения', 'description' => 'Изучите примеры перевозок и логистических проектов, которые команда SedMiTrans реализовала для бизнеса.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'contacts', 'name' => 'Контакты', 'path' => '/contacts', 'title' => 'Контакты SedMiTrans — организуем вашу перевозку', 'description' => 'Свяжитесь с SedMiTrans, чтобы обсудить маршрут, груз, сроки доставки и получить расчёт стоимости перевозки.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'auto-transportation', 'name' => 'Автоперевозки', 'path' => '/uslugi/avtoperevozki', 'title' => 'Автоперевозки грузов по России и СНГ — SedMiTrans', 'description' => 'Организуем полные и сборные автоперевозки от склада отправителя до двери получателя с контролем маршрута и документов.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'rail-transportation', 'name' => 'Железнодорожные перевозки', 'path' => '/uslugi/zheleznodorozhnye-perevozki', 'title' => 'Железнодорожные перевозки грузов — SedMiTrans', 'description' => 'Планируем железнодорожную доставку по России и международным направлениям, подбираем схему, вагоны и терминалы.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'air-transportation', 'name' => 'Авиаперевозки', 'path' => '/uslugi/aviaperevozki', 'title' => 'Авиаперевозки грузов по России и миру — SedMiTrans', 'description' => 'Ускоряем доставку срочных и ценных грузов: организуем авиаперевозку, обработку в аэропорту и сопровождение документов.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'multimodal-transportation', 'name' => 'Мультимодальные перевозки', 'path' => '/uslugi/multimodalnye-perevozki', 'title' => 'Мультимодальные перевозки грузов — SedMiTrans', 'description' => 'Соединяем автомобильный, железнодорожный, морской и авиационный транспорт в единую управляемую цепочку доставки.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'oversized-cargo', 'name' => 'Негабаритные грузы', 'path' => '/uslugi/negabaritnie-gruzy', 'title' => 'Перевозка негабаритных грузов — SedMiTrans', 'description' => 'Перевозим оборудование, технику и крупные конструкции: прорабатываем маршрут, подбираем транспорт и организуем крепление.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'dangerous-cargo', 'name' => 'Опасные грузы', 'path' => '/uslugi/opasniye-gruzy', 'title' => 'Перевозка опасных грузов — SedMiTrans', 'description' => 'Организуем безопасную перевозку опасных грузов с учётом класса опасности, требований к транспорту и комплекта документов.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'customs-clearance', 'name' => 'Таможенное оформление', 'path' => '/uslugi/tamozhennoe-oformlenie', 'title' => 'Таможенное оформление грузов — SedMiTrans', 'description' => 'Сопровождаем таможенное оформление, проверяем документы и помогаем пройти процедуры без лишних задержек.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'cargo-insurance', 'name' => 'Страхование грузов', 'path' => '/uslugi/strahovanie-gruzov', 'title' => 'Страхование грузов при перевозке — SedMiTrans', 'description' => 'Помогаем защитить груз от рисков перевозки и подобрать страховое покрытие с учётом маршрута и характеристик отправления.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'warehouse-logistics', 'name' => 'Складская логистика', 'path' => '/uslugi/skladskaya-logistika', 'title' => 'Складская логистика и ответственное хранение — SedMiTrans', 'description' => 'Организуем хранение, обработку, комплектацию и отгрузку товаров, связывая складские операции с доставкой.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'ved-consulting', 'name' => 'Консультирование по вопросам ВЭД', 'path' => '/uslugi/konsultirovanie-po-voprosam-ved', 'title' => 'Консультации по ВЭД и международной логистике — SedMiTrans', 'description' => 'Помогаем разобраться в международных поставках, документах, маршрутах и требованиях к внешнеэкономической деятельности.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'personal-data-policy', 'name' => 'Политика обработки персональных данных', 'path' => '/politika-obrabotki-personalnyh-dannyh', 'title' => 'Политика обработки персональных данных — SedMiTrans', 'description' => 'Официальная политика обработки и защиты персональных данных пользователей сайта SedMiTrans.', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'personal-data-consent', 'name' => 'Согласие на обработку персональных данных', 'path' => '/soglasie-na-obrabotku-personalnyh-dannyh', 'title' => 'Согласие на обработку персональных данных — SedMiTrans', 'description' => 'Условия согласия на обработку персональных данных пользователей сайта SedMiTrans.', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_pages');
    }
};
