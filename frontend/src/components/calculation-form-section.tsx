import { Box, Button, SimpleGrid, TextInput, Title } from '@mantine/core';
import styles from './calculation-form-section.module.css';

export function CalculationFormSection() {
  return (
    <section id="calculation" className={styles.section}>
      <Title order={2} className={styles.heading}>Получите расчет стоимости перевозки</Title>
      <Box component="form" className={styles.form}>
        <SimpleGrid cols={3} spacing="md">
          <TextInput label="ФИО" placeholder="Введите ФИО" />
          <TextInput label="Телефон" placeholder="+7 (___) ___-__-__" inputMode="tel" />
          <TextInput label="Что перевозим" placeholder="Опишите груз" />
          <TextInput label="Маршрут" placeholder="Страна-город" />
          <TextInput label="Параметры груза" placeholder="Д х Ш х В, вес брутто" />
          <Button type="button" color="brandOrange" size="md" className={styles.submit}>
            Получить расчет
          </Button>
        </SimpleGrid>
      </Box>
    </section>
  );
}
