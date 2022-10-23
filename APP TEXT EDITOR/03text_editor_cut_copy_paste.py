from tkinter import *
from tkinter import ttk
from tkinter.ttk import Scrollbar
from tkinter import filedialog
from tkinter import font
from PIL import ImageTk, Image
import ctypes, os
ctypes.windll.shcore.SetProcessDpiAwareness(True)

root = Tk()
root.title("Untitled Python - Textpad")
root.geometry('800x800+400+50')
root['bg'] = "#f0f0f0"
root.iconbitmap(r'./ico/texteditor.ico')

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
        print(save_filename)

        # Save the file
        with open(filename, "wt") as f:
            f.write(my_text.get(1.0, END))
            
    else:
        pass

def cut_text(e):
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
    
def copy_text(e):
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

def paste_text(e):
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


# NOTE: Create Menu Bar
menu_bar = Menu(root, bg='red', activebackground='red', selectcolor='red', foreground='green')

# Declare File and Edit Menu for showing in Menubar
file_menu = Menu(menu_bar, tearoff=0)
edit_menu = Menu(menu_bar, tearoff=0)

# Display File and Edit on MenuBar
menu_bar.add_cascade(label="File", menu=file_menu)
menu_bar.add_cascade(label="Edit", menu=edit_menu)

# Add File-menu items 
file_menu.add_command(label="New File", command=new_file, activebackground='red')
file_menu.add_command(label="Open File", command=open_file, activebackground='red')
file_menu.add_command(label="Save", command=save_file, activebackground='red')
file_menu.add_command(label="Save As", command=save_as_file, activebackground='red')
file_menu.add_separator()
file_menu.add_command(label="Exit", command=root.destroy, activebackground='red')

# Add Edit-menu items
edit_menu.add_command(label="Undo", command=do_nothing, activebackground='red')
edit_menu.add_command(label="Redo", command=do_nothing, activebackground='red')
edit_menu.add_separator()
edit_menu.add_command(label="Cut          ctrl + x", command=lambda: cut_text(False), activebackground='red')
edit_menu.add_command(label="Copy       ctrl + c", command=lambda: copy_text(False), activebackground='red')
edit_menu.add_command(label="Paste       ctrl + v", command=lambda: paste_text(False), activebackground='red')
edit_menu.add_separator()
edit_menu.add_command(label="Find", command=do_nothing, activebackground='red')
edit_menu.add_command(label="Replace", command=do_nothing, activebackground='red')




# NOTE: Create Main Frame
master_frame = Frame(root, bg="white")
master_frame.pack( fill=BOTH, expand=True)

# Create Scroll bar
my_scrollbar = Scrollbar(master_frame, orient=VERTICAL)
my_scrollbar.pack(side=RIGHT, fill=Y)


# Create Text Widget
my_text = Text(master_frame, font=("Helvetica", 15), width=50, selectbackground="#575a5a", selectforeground="white", yscrollcommand=my_scrollbar.set, undo=True)
my_text.pack(padx=(5,0), fill=BOTH, expand=True)

# Connect Scrollbar to my_text Text_widget
my_scrollbar.configure(command=my_text.yview)


# Edit binding's
root.bind("<Control-Key-x>", cut_text)
root.bind("<Control-Key-c>", copy_text)
root.bind("<Control-Key-v>", paste_text)



# Configure Menu
root.configure(menu=menu_bar)
root.mainloop()
