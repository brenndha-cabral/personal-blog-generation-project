import { Post } from '../../src/post/entities/post.entity';
import { Theme } from '../../src/theme/entities/theme.entity';
import { User } from '../../src/user/entities/user.entity';

describe('Post Entity', () => {
  it('deve instanciar e acessar todos os campos', () => {
    const theme = { id: 1, description: 'T1' } as Theme;
    const user = { id: 2, user: 'mail@mail.com' } as User;
    const post = new Post();
    post.id = 10;
    post.title = 'Título';
    post.text = 'Texto';
    post.readingType = 'Leitura de 3 cartas';
    post.cards = ['O Louco', 'A Sacerdotisa'];
    post.created_at = new Date('2024-01-01');
    post.update_at = new Date('2024-01-02');
    post.theme = theme;
    post.user = user;

    expect(post.id).toBe(10);
    expect(post.title).toBe('Título');
    expect(post.text).toBe('Texto');
    expect(post.readingType).toBe('Leitura de 3 cartas');
    expect(post.cards).toEqual(['O Louco', 'A Sacerdotisa']);
    expect(post.created_at).toEqual(new Date('2024-01-01'));
    expect(post.update_at).toEqual(new Date('2024-01-02'));
    expect(post.theme).toBe(theme);
    expect(post.user).toBe(user);
  });
});
