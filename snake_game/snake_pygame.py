import pygame
import random
import os

# NOTE: Initialising the modules
pygame.mixer.init() # for songs
pygame.init()


# NOTE: Creating color 
white = (255, 255, 255)
red = (255, 0, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
black = pygame.Color('Black')

# NOTE: Screen Variables
screen_width = 1000
screen_height = 500
size = (screen_width, screen_height)

# Creating the gameWindow
gameWindow = pygame.display.set_mode(size)
pygame.display.set_caption("Snake Game-Rohit") # Title of the game Window
pygame.display.update()

# Background image -> snake
bg_intro = pygame.image.load('intro.jpg')
bg_intro = pygame.transform.scale(bg_intro, (screen_width, screen_height)).convert_alpha()
# Background image -> snake
bg_img = pygame.image.load('snake.jpg')
bg_img = pygame.transform.scale(bg_img, (screen_width, screen_height)).convert_alpha()
# Background image -> Gameover 
bg_gameover = pygame.image.load('gameover.jpg')
bg_gameover = pygame.transform.scale(bg_gameover, (screen_width, screen_height)).convert_alpha()

# Clock for FPS
clock = pygame.time.Clock()
font = pygame.font.SysFont(None, 55)

# Display Score()
def text_on_screen(text, color, x, y):
    # Anti-alising 3rd argument TRUE
    screen_text = font.render(text, True, color)
    gameWindow.blit(screen_text, (x,y))

def plot_snake(gameWindow, color, snk_list, snake_size):
    for x,y in snk_list:
        pygame.draw.ellipse(gameWindow, color, [x, y, snake_size, snake_size])

def welcome():
    
    # Playing music Industry Baby 
    pygame.mixer.music.load('INDUSTRY_BABY.mp3')
    # pygame.mixer.music.set_volume(0.1)
    pygame.mixer.music.play()

    exit_game = False
    while not exit_game:
        gameWindow.fill(white)
        gameWindow.blit(bg_intro, (0,0))
        text_on_screen('Welcome to Snake Game', red, 250, 290)
        text_on_screen('Press Space-Bar to continue', pygame.Color('Dark green'), 225, 330)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit_game = True
            
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                # Calling gameloop()
                    gameloop()

        # Update the Screen
        pygame.display.update()
        clock.tick(60)


def gameloop():

    # Game Specific Variables
    exit_game = False
    game_over = False
    
    # Snake Variables
    snake_x = 50
    snake_y = 50
    snake_size = 20
    velocity_x = 0
    velocity_y = 0
    init_velocity = 5
    food_x = random.randint(50, screen_width - 100) # food 
    food_y = random.randint(50, screen_height - 100) # food
    score = 0
    fps = 60

    # Draw long snake
    snk_list = []
    snk_length = 1

    # READ HIGH SCORE
    if (not os.path.exists('highscore.txt')):
        with open('highscore.txt', 'w') as f:
            f.write('0')
    with open('highscore.txt', 'r') as f:
        highscore = f.read()

    # Game Loop
    while not exit_game:

        # GameOver
        if game_over:
            gameWindow.fill(white)
            gameWindow.blit(bg_gameover, (0,0))
            text_on_screen("Press Enter to continue...", blue, 265, 300)
            text_on_screen(f"Score: {score}", pygame.Color('green'), 400, 350)


            with open('highscore.txt', 'w') as f:
                f.write(str(highscore))

            # Events in python
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    exit_game = True
                
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_RETURN:
                        welcome()

        else:
            # Events in python
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    exit_game = True

                if event.type == pygame.KEYDOWN:
                    
                    # MOVEMENTS, UP, DOWN, LEFT, RIGHT
                    if event.key == pygame.K_RIGHT:
                        velocity_x = init_velocity
                        velocity_y = 0
                        
                    if event.key == pygame.K_LEFT:
                        velocity_x = -init_velocity
                        velocity_y = 0

                    if event.key == pygame.K_UP:
                        velocity_x = 0
                        velocity_y = -init_velocity

                    if event.key == pygame.K_DOWN:
                        velocity_x = 0
                        velocity_y = init_velocity

    # NOTE: cheat-Code KEY: Q
                    if event.key == pygame.K_q:
                        score += 10
            
            # EAT FOOD and UPDATE FOOD, SCORE
            if abs(snake_x - food_x) < 15 and abs(snake_y - food_y) < 15:
                # Play music
                pygame.mixer.music.load('point.mp3')
                pygame.mixer.music.play()
                score += 10
                food_x = random.randint(50, screen_width - 100) # food 
                food_y = random.randint(50, screen_height - 100) # food            
                snk_length += 5 # increase snake length

                if score > int(highscore):
                    highscore = score # int->score        

            # AutoMove Snake
            snake_x = snake_x + velocity_x
            snake_y = snake_y + velocity_y

            # set the BackGround and Color
            gameWindow.fill(white)
            gameWindow.blit(bg_img, (0,0))

            # Snake food
            pygame.draw.ellipse(gameWindow, red, [food_x, food_y, snake_size, snake_size])

            # Score on screen
            text_on_screen("Score: " + str(score) + '    High Score: ' + str(highscore), blue, 5, 5)

            # snake co-ordinates list
            head = []
            head.append(snake_x)
            head.append(snake_y)
            snk_list.append(head)

            # Controlling the length of the snake
            if len(snk_list) > snk_length :
                del snk_list[0]

            # snake touches itself
            if head in snk_list[:-1]: # last one is excluded because the last one is itself
                # present inside the list because we are appending the list
                
                # Play music gameOver
                pygame.mixer.music.load('gameover.mp3')
                pygame.mixer.music.play()
                game_over = True

            # Draw Snake
            plot_snake(gameWindow, black, snk_list, snake_size)

            # gameOver
            if (snake_x < 0 or snake_y < 0 or snake_x > screen_width or snake_y > screen_height):
                # Play music gameOver
                pygame.mixer.music.load('gameover.mp3')
                pygame.mixer.music.play()
                game_over = True      

        # Update the Screen
        pygame.display.update()
        clock.tick(fps)

    pygame.quit()  # pygame quit() function
    quit()  # python quit() function

welcome()