from json import tool
from tkinter import *
from tkinter.ttk import Scrollbar
from tkinter import filedialog
from tkinter import font
from tkinter import colorchooser
from PIL import ImageTk, Image
import ctypes, os
from numpy import False_
import win32api
# import win32print
ctypes.windll.shcore.SetProcessDpiAwareness(True)


root = Tk()
root.title("Untitled Python - Textpad")
root.geometry('800x800+400+50')
root['bg'] = "#f0f0f0"
root.iconbitmap(r'./ico/texteditor.ico')

# Create title bar frame for the buttons redo/undo/bold/italic
toolbar_frame = Frame(root)
toolbar_frame.pack(fill=X)


# Status Bar
bottom_frame = Frame(root)
status_bar = Label(root, text="Status Bar")
status_bar.pack(side=BOTTOM, anchor="se", padx=(0, 15))
bottom_frame.pack(side=BOTTOM)

global filetypes
global filename
global selected_text
selected_text = ""
filename = ""
filetypes = (
    ("Text files(.txt)", "*.txt"),
    ("HTML files(.html)", "*.html"),
    ("Python files(.py)", "*.py"),
    ("C++ files(.cpp)", "*.cpp"),
    ("All files", "*.*")
)


def do_nothing():
    pass


# Create new file function
def new_file():
    # Clear text box
    my_text.delete("1.0", END)
    root.title("New file - Untitled")


# Open files
def open_file():
    try:
        global filetypes
        # Clear text box
        my_text.delete("1.0", END)

        # Get filename
        global filename
        filename = filedialog.askopenfilename(title="Open file", initialdir=os.getcwd(), filetypes=filetypes, defaultextension="*.txt")

        # Get Parent_dir
        parent_dir = os.path.dirname(filename)
        # Change '/' to nothing for only filename
        top_filename = filename.replace(parent_dir + "/", "")

        # Set title name
        if filename != "":
            root.title(top_filename)
        else:
            root.title("Untitled - Textpad")
        
        # Write data on text box
        with open(filename, "r") as f:
            data = f.read()
        my_text.insert("1.0", data)

        # Set Status_bar
        status_bar.config(text=filename)
    
    # if we didn't select any file then it'll generate some error
    except:
        pass
        
    
# Save File
def save_file():
    # if we select some file
    global filename
    if filename:
        # write data into that file
        with open(filename, "wt") as f:
            f.write(my_text.get(1.0, END))
        # update the status_bar
        status_bar.configure(text=filename)
    else:
        save_as_file()

    
    

# Saves as file
def save_as_file():
    filename = filedialog.asksaveasfilename(title="Saves as new file", initialdir=os.getcwd(), filetypes=filetypes, defaultextension=".*")
    
    if filename:
        # update status_bar 
        status_bar.config(text=f"{filename}")

        # Get Parent_dir
        parent_dir = os.path.dirname(filename)
        # Change '/' to nothing for only filename
        save_filename = filename.replace(parent_dir + "/", "")
        # print(save_filename)

        # Save the file
        with open(filename, "wt") as f:
            f.write(my_text.get(1.0, END))
            
    else:
        pass

def cut_text(e):
    try:
        global selected_text
        # Check to see if keyboard is shortcut is used
        if e:
            selected_text = root.clipboard_get()
        else:
            if my_text.selection_get():
                # Grab the selected text
                selected_text = my_text.selection_get()
                # Delete the selected text
                my_text.delete("sel.first", "sel.last")
                # clear the clipboard & append the selected data in clipboard
                root.clipboard_clear()
                root.clipboard_append(selected_text)
    except:
        pass
    
def copy_text(e):
    try:
        global selected_text
        # check if the user used the keyboard then it means some event happen
        if e:
            # get the data from clipboard
            selected_text = root.clipboard_get()

        if my_text.selection_get():
            # Grab the selected text
            selected_text = my_text.selection_get()
            # clear the clipboard & append the selected data in clipboard
            root.clipboard_clear()
            root.clipboard_append(selected_text)
    except:
        pass

def paste_text(e):
    try:
        global selected_text
        # check if the user used the keyboard then it means some event happen
        if e:
            # this one is handled by tkinter + windows
            # Taking text from Clipboard
            selected_text = root.clipboard_get()
        else:
            if selected_text:
                # Grab the position where you want to insert the selected
                position = my_text.index(INSERT)
                # insert the selected into to textbox
                my_text.insert(position, selected_text)
    except:
        pass
                
    
def undo():
    """This function is used for undo the operation"""
    try:
        # Inbuilt in tkinter
        my_text.edit_undo()
    # if there is nothing to undo then it'll generate the error message
    except:
        pass

def redo():
    """This function is used for redo the operation"""
    try:
        # Inbuilt in tkinter
        my_text.edit_redo() 
    # if there is nothing to redo then it'll generate the error message
    except:
        pass

def italics_text():
    # Create our font i.e. bold
    italic_font = font.Font(my_text, my_text.cget("font"))
    italic_font.configure(slant="italic")

    # Configure a tag
    my_text.tag_configure("italic", font=italic_font)

    # current tags
    current_tags = my_text.tag_names("sel.first")
    
    # if statement to see if the tag has been selected or not
    if "italic" in current_tags:
        my_text.tag_remove("italic", "sel.first", "sel.last")
    else:
        my_text.tag_add("italic", "sel.first", "sel.last")


def bold_text():
    # Create our font i.e. bold
    bold_font = font.Font(my_text, my_text.cget("font"))
    bold_font.configure(weight="bold")

    # Configure a tag
    my_text.tag_configure("bold", font=bold_font)

    # current tags
    current_tags = my_text.tag_names("sel.first")
    
    # if statement to see if the tag has been selected or not
    if "bold" in current_tags:
        my_text.tag_remove("bold", "sel.first", "sel.last")
    else:
        my_text.tag_add("bold", "sel.first", "sel.last")

def text_color():
    # NOTE: Pick a color | Font color is a tuple having RGB + hex values
    font_color = colorchooser.askcolor()[1]
    if font_color:
        # # Font color is a tuple having RGB + hex values
        # print(font_color)
        
        # Create our font i.e. bold
        text_color_font = font.Font(my_text, my_text.cget("font"))

        # Configure a tag
        my_text.tag_configure("colored", font=text_color_font, foreground=font_color)

        # current tags
        current_tags = my_text.tag_names("sel.first")
        # print(current_tags)
        # if statement to see if the tag has been selected or not
        if "colored" in current_tags:
            my_text.tag_remove("colored", "sel.first", "sel.last")
        else:
            my_text.tag_add("colored", "sel.first", "sel.last")
    
def all_text_color():
    font_color = colorchooser.askcolor()[1]
    if font_color:
        my_text.configure(fg=font_color)
    else:
        pass
    
def bg_color():
    font_color = colorchooser.askcolor()[1]
    if font_color:
        my_text.configure(bg=font_color)
    else:
        pass

def print_file():
    # printer_name = win32print.GetDefaultPrinter()
    # status_bar.configure(text=printer_name)
    file_path = filedialog.askopenfilename(title="Open file", initialdir=os.getcwd(), filetypes=filetypes, defaultextension="*.txt")
    if file_path:
        win32api.ShellExecute(0, "print", file_path, None, ".", 0)

def select_all(e):
    # Select All
    my_text.tag_add("sel", "1.0", END)

def clear_all():
    # Delete all
    my_text.delete(1.0, END)
        


# NOTE: Create Menu Bar
menu_bar = Menu(root, bg='red', activebackground='red', selectcolor='red', foreground='green')

# Declare File and Edit Menu for showing in Menubar
file_menu = Menu(menu_bar, tearoff=0)
edit_menu = Menu(menu_bar, tearoff=0)
color_menu = Menu(menu_bar, tearoff=0)

# Display File and Edit on MenuBar
menu_bar.add_cascade(label="File", menu=file_menu)
menu_bar.add_cascade(label="Edit", menu=edit_menu)
menu_bar.add_cascade(label="Colors", menu=color_menu)



# Add File-menu items 
file_menu.add_command(label="New File", command=new_file, activebackground='red')
file_menu.add_command(label="Open File", command=open_file, activebackground='red')
file_menu.add_command(label="Save", command=save_file, activebackground='red')
file_menu.add_command(label="Save As", command=save_as_file, activebackground='red')
file_menu.add_separator()
file_menu.add_command(label="Print File", command=print_file, activebackground='red')
file_menu.add_separator()
file_menu.add_command(label="Exit", command=root.destroy, activebackground='red')

# Add Edit-menu items
edit_menu.add_command(label="Undo", command=undo, activebackground='red', accelerator="(Ctrl+Z)")
edit_menu.add_command(label="Redo", command=redo, activebackground='red', accelerator="(Ctrl+Y)")
edit_menu.add_separator()
edit_menu.add_command(label="Cut", command=lambda: cut_text(False), activebackground='red', accelerator="(Ctrl+X)")
edit_menu.add_command(label="Copy", command=lambda: copy_text(False), activebackground='red', accelerator="(Ctrl+C)")
edit_menu.add_command(label="Paste", command=lambda: paste_text(False), activebackground='red', accelerator="(Ctrl+V)")
edit_menu.add_separator()
edit_menu.add_command(label="Find", command=do_nothing, activebackground='red')
edit_menu.add_command(label="Replace", command=do_nothing, activebackground='red')
edit_menu.add_separator()
edit_menu.add_command(label="Select All", command=lambda: select_all(False), activebackground='red', accelerator="(Ctrl+A)")
edit_menu.add_command(label="Clear All", command=clear_all, activebackground='red', accelerator="(Ctrl+X)")

# Add items to color-menu
color_menu.add_command(label="Selected text", command=text_color, activebackground='red')
color_menu.add_command(label="All text", command=all_text_color, activebackground='red')
color_menu.add_command(label="Background", command=bg_color, activebackground='red')



# NOTE: Create Main Frame
master_frame = Frame(root, bg="white")
master_frame.pack( fill=BOTH, expand=True)

# Create Scroll bar
vertical_scrollbar = Scrollbar(master_frame, orient=VERTICAL)
vertical_scrollbar.pack(side=RIGHT, fill=Y)

horizontal_scrollbar = Scrollbar(master_frame, orient=HORIZONTAL)
horizontal_scrollbar.pack(side=BOTTOM, fill=X)


# Create Text Widget
my_text = Text(master_frame, bg="white", font=("Helvetica", 15), width=50, selectbackground="#575a5a", selectforeground="white", xscrollcommand=horizontal_scrollbar.set, yscrollcommand=vertical_scrollbar.set, undo=True, wrap="none")
my_text.pack(padx=(5,0), fill=BOTH, expand=True)

# Connect Scrollbar to my_text Text_widget
horizontal_scrollbar.configure(command=my_text.xview)
vertical_scrollbar.configure(command=my_text.yview)


# Edit binding's
root.bind("<Control-Key-x>", cut_text)
root.bind("<Control-Key-c>", copy_text)
root.bind("<Control-Key-v>", paste_text)

root.bind("<Control-A>", select_all)
root.bind("<Control-a>", select_all)




# Create toolbar buttons
bold_btn = Button(toolbar_frame, text="Bold", font=("Helvetica", 10), command=bold_text)
bold_btn.grid(row=0, column=0, padx=10, sticky='w')

italic_btn = Button(toolbar_frame, text="Italic", font=("Helvetica", 10), command=italics_text)
italic_btn.grid(row=0, column=1, padx=10, sticky='w')

undo_btn = Button(toolbar_frame, text="Undo", font=("Helvetica", 10), command=undo)
undo_btn.grid(row=0, column=2, padx=10, sticky='w')

redo_btn = Button(toolbar_frame, text="Redo", font=("Helvetica", 10), command=redo)
redo_btn.grid(row=0, column=3, padx=10, sticky='w')

text_color_btn = Button(toolbar_frame, text="Text Color", font=("Helvetica", 10), command=text_color)
text_color_btn.grid(row=0, column=4, padx=10, sticky='w')



# Configure Menu
root.configure(menu=menu_bar)
root.mainloop()
