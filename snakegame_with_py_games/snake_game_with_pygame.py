import pygame
from sys import exit
from random import randint


class Snake:
    def __init__(self):
        self.body = [pygame.math.Vector2(6, 10), pygame.math.Vector2(
            5, 10), pygame.math.Vector2(4, 10)]
        self.direction = pygame.math.Vector2(0, 0)
        self.new_block = False

        self.head_up = pygame.image.load("head_up.png")
        self.head_down = pygame.image.load("head_down.png")
        self.head_right = pygame.image.load("head_right.png")
        self.head_left = pygame.image.load("head_left.png")

        self.tail_up = pygame.image.load("tail_up.png")
        self.tail_down = pygame.image.load("tail_down.png")
        self.tail_left = pygame.image.load("tail_left.png")
        self.tail_right = pygame.image.load("tail_right.png")

        self.body_vertical = pygame.image.load("body_vertical.png")
        self.body_horizontal = pygame.image.load("body_horizontal.png")

        self.body_tr = pygame.image.load("body_topright.png")
        self.body_tl = pygame.image.load("body_topleft.png")
        self.body_bl = pygame.image.load("body_bottomleft.png")
        self.body_br = pygame.image.load("body_bottomright.png")

    def draw_snake(self):

        self.update_head_graphics()
        self.update_tail_graphics()
        for index, block in enumerate(self.body):
            x_pos = block.x*cell_size
            y_pos = block.y*cell_size
            block_rect = pygame.Rect(x_pos, y_pos, cell_size, cell_size)
            if index == 0:
                screen.blit(self.head, block_rect)
            elif index == len(self.body)-1:
                screen.blit(self.tail, block_rect)
            else:
                previous_block = self.body[index+1]-block
                next_block = self.body[index-1]-block
                if previous_block.x == next_block.x:
                    screen.blit(self.body_vertical, block_rect)
                elif previous_block.y == next_block.y:
                    screen.blit(self.body_horizontal, block_rect)
                else:
                    if previous_block.x == -1 and next_block.y == -1 or previous_block.y == -1 and next_block.x == -1:
                        screen.blit(self.body_tl, block_rect)
                    elif previous_block.x == -1 and next_block.y == 1 or previous_block.y == 1 and next_block.x == -1:
                        screen.blit(self.body_bl, block_rect)
                    elif previous_block.x == 1 and next_block.y == -1 or previous_block.y == -1 and next_block.x == 1:
                        screen.blit(self.body_tr, block_rect)
                    elif previous_block.x == 1 and next_block.y == 1 or previous_block.y == 1 and next_block.x == 1:
                        screen.blit(self.body_br, block_rect)

    def update_head_graphics(self):
        head_rel = self.body[1]-self.body[0]
        if head_rel == pygame.math.Vector2(1, 0):
            self.head = self.head_left
        elif head_rel == pygame.math.Vector2(-1, 0):
            self.head = self.head_right
        elif head_rel == pygame.math.Vector2(0, 1):
            self.head = self.head_up
        elif head_rel == pygame.math.Vector2(0, -1):
            self.head = self.head_down

    def update_tail_graphics(self):
        head_rel = self.body[-2]-self.body[-1]
        if head_rel == pygame.math.Vector2(1, 0):
            self.tail = self.tail_left
        elif head_rel == pygame.math.Vector2(-1, 0):
            self.tail = self.tail_right
        elif head_rel == pygame.math.Vector2(0, 1):
            self.tail = self.tail_up
        elif head_rel == pygame.math.Vector2(0, -1):
            self.tail = self.tail_down

    def move_snake(self):
        if self.new_block == True:
            body_copy = self.body[:]
            body_copy.insert(0, body_copy[0]+self.direction)
            self.body = body_copy
            self.new_block = False
        else:
            body_copy = self.body[:-1]
            body_copy.insert(0, body_copy[0]+self.direction)
            self.body = body_copy[:]

    def add_block(self):
        self.new_block = True


class Fruit:
    def __init__(self):
        self.change_position()

    def draw_fruit(self):
        fruit_rect = pygame.Rect(self.pos.x*cell_size,
                                 self.pos.y*cell_size, cell_size, cell_size)
        screen.blit(apple, fruit_rect)

    def change_position(self):
        self.x = randint(0, cell_number-1)
        self.y = randint(0, cell_number-1)
        self.pos = pygame.math.Vector2(self.x, self.y)


class Main:
    def __init__(self):
        self.snake = Snake()
        self.fruit = Fruit()
        self.score=0
        with open("high_score.txt") as some_num:
            self.high_score=some_num.read()
        
        

    def update(self):
        self.snake.move_snake()
        self.check_colission()
        self.check_player_over()

    def draw_element(self):
        self.draw_grass()
        self.draw_score()
        self.fruit.draw_fruit()
        self.snake.draw_snake()

    def check_colission(self):
        if self.fruit.pos == self.snake.body[0]:
            self.fruit.change_position()
            self.snake.add_block()
        for block in self.snake.body[1:]:
            if block == self.fruit.pos:
                self.fruit.change_position()

    def check_player_over(self):
        if not 0 <= self.snake.body[0].x < cell_number:
            self.game_over()
        if not 0 <= self.snake.body[0].y < cell_number:
            self.game_over()
        for block in self.snake.body[1:]:
            if block == self.snake.body[0]:
                self.game_over()

    def game_over(self):
        self.reset()

    def draw_grass(self):
        grass_colour = (167, 209, 61)

        for row in range(cell_number):
            if row % 2 == 0:
                for coloumn in range(cell_number):
                    if coloumn % 2 == 0:
                        grass_rect = pygame.Rect(
                            coloumn*cell_size, row*cell_size, cell_size, cell_size)
                        pygame.draw.rect(screen, grass_colour, grass_rect)
            else:
                for coloumn in range(cell_number):
                    if coloumn % 2 != 0:
                        grass_rect = pygame.Rect(
                            coloumn*cell_size, row*cell_size, cell_size, cell_size)
                        pygame.draw.rect(screen, grass_colour, grass_rect)

    def draw_score(self):  
        self.score = str(len(self.snake.body)-3)
        score_surface = game_font.render(self.score, True, (56, 74, 12))
        high_score_surface=game_font.render(f"HighScore: {self.high_score}", True, (56, 74, 12))
        score_x = cell_size*cell_number-50
        score_y = cell_size*cell_number-40
        high_score_x=cell_size*3-10
        high_score_y=cell_size-10
        score_rect = score_surface.get_rect(center=(score_x, score_y))
        high_score_rect=high_score_surface.get_rect(center=(high_score_x,high_score_y))
        apple_rect = apple.get_rect(
            midright=(score_rect.left, score_rect.centery))
        screen.blit(score_surface, score_rect)
        screen.blit(apple, apple_rect)
        screen.blit(high_score_surface, high_score_rect)
        
        

    def reset(self):
        self.snake.body = [pygame.math.Vector2(6, 10), pygame.math.Vector2(
            5, 10), pygame.math.Vector2(4, 10)]
        self.snake.direction = pygame.math.Vector2(0, 0)
        if int(self.score)>int(self.high_score):
            self.high_score=str(self.score)
            with open("high_score.txt",mode="w") as some_score:
                some_score.write(self.high_score)
        


pygame.init()

cell_size = 40
cell_number = 18
screen = pygame.display.set_mode(
    (cell_size*cell_number, cell_size*cell_number))
pygame.display.set_caption("Snake_game with pygame")
clock = pygame.time.Clock()
apple = pygame.image.load("apple.png").convert_alpha()
game_font = pygame.font.Font(None, 40)

main_game = Main()

SCREEN_UPDATE = pygame.USEREVENT
pygame.time.set_timer(SCREEN_UPDATE, 150)


game_on = True
while game_on:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            exit()
        if event.type == SCREEN_UPDATE:
            main_game.update()
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                if main_game.snake.direction == pygame.math.Vector2(0, 1):
                    pass
                else:
                    main_game.snake.direction = pygame.math.Vector2(0, -1)
            if event.key == pygame.K_DOWN:
                if main_game.snake.direction == pygame.math.Vector2(0, -1):
                    pass
                else:
                    main_game.snake.direction = pygame.math.Vector2(0, 1)
            if event.key == pygame.K_LEFT:
                if main_game.snake.direction == pygame.math.Vector2(1, 0):
                    pass
                else:
                    main_game.snake.direction = pygame.math.Vector2(-1, 0)
            if event.key == pygame.K_RIGHT:
                if main_game.snake.direction == pygame.math.Vector2(-1, 0):
                    pass
                else:
                    main_game.snake.direction = pygame.math.Vector2(1, 0)
    screen.fill((176, 215, 80))
    main_game.draw_element()
    pygame.display.update()
    clock.tick(60)
