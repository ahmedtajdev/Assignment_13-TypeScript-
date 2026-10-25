class User {
  public id: number;
  public age: number;
  private _notebooks: NoteBook[] = [];
  private static _nextId: number = 1;
  private static _users: User[] = [];

  public get notebooks(): NoteBook[] {
    return [...this._notebooks];
  }

  public static get users(): User[] {
    return [...User._users];
  }

  public displayInfo(): void {
    const { password, phone, ...info } = this;
    console.log(`{`);
    for (const [key, value] of Object.entries(info)) {
      console.log(`\t${key}: ${value}`);
    }
    console.log(`}`);
  }
  constructor(
    public name: string,
    public email: string,
    private password: string,
    private phone: string,
    age: number,
  ) {
    if (age >= 18 && age <= 60) {
      this.age = age;
    } else {
      throw new Error("Age must be between 18 and 60.");
    }
    this.id = User._nextId++;
    this._notebooks = NoteBook.notebooks.filter(
      (notebook) => notebook.owner === this,
    );
    User._users.push(this);
  }
}

class Admin extends User {
  constructor(
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number,
  ) {
    super(name, email, password, phone, age);
  }

  manageNotes(notebook: NoteBook): void {
    console.log(`Managing notebook: ${notebook.name}`);
  }
}

class Note {
  private static _nextId: number = 1;
  public id: number;
  public preview(): string {
    const words = this.content.trim().split(" ");

    if (words.length <= 5) {
      return words.join(" ");
    }

    return `${words.slice(0, 5).join(" ")}...`;
  }
  constructor(
    public title: string,
    public content: string,
    public author: User,
    public notebook: NoteBook,
  ) {
    this.id = Note._nextId++;
  }
}

class NoteBook {
  private static _nextId: number = 1;
  public id: number;

  private static _notebooks: NoteBook[] = [];

  private _notes: Note[] = [];

  public get notes() {
    return [...this._notes];
  }

  public static get notebooks() {
    return [...NoteBook._notebooks];
  }

  public addNote(title: string, content: string, author: User): void {
    try {
      if (author !== this.owner) {
        throw new Error("You are not the owner of this notebook.");
      }

      const note = new Note(title, content, author, this);

      this._notes.push(note);
    } catch (error) {
      console.log(error);
    }
  }

  public removeNote(noteId: number, userId: number) {
    try {
      if (userId !== this.owner.id) {
        throw new Error("You are not the owner of this notebook.");
      }
      const newNotes = this._notes.filter((note) => note.id !== noteId);

      if (newNotes.length === this._notes.length) {
        throw new Error(`Note with id ${noteId} not found.`);
      }
      this._notes = newNotes;
    } catch (error) {
      console.log(error);
    }
  }

  constructor(
    public name: string,
    public owner: User,
  ) {
    this.id = NoteBook._nextId++;
    NoteBook._notebooks.push(this);
  }
}

class Storage<T> {
  private static _nextId: number = 1;
  public id: number;

  public items: Array<T> = [];

  constructor(
    public name: string,
    public count: number,
  ) {
    this.id = Storage._nextId++;
  }
  addItem(item: T): void {
    this.items.push(item);
    console.log(`Item added successfully`);
  }
  removeItem(item: T): void {
    const index = this.items.indexOf(item);
    this.items = this.items.splice(index, 1);
    console.log(`Item removed successfully`);
  }
  getAllItems(): Array<T> {
    return [...this.items];
  }
}
