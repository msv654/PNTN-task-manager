import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('🌻To do list', 'list'),
      Markup.button.callback('🍯Create task', 'create'),
      Markup.button.callback('✅Task completed', 'done'),
      Markup.button.callback('✍️Task edit', 'edit'),
      Markup.button.callback('❌Delete the task', 'delete'),
    ],
    {
      columns: 2,
    },
  );
}
