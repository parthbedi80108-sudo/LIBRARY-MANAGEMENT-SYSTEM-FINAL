#include "Library.h"
#include <iostream>
Library::Library() {
    historyHead = nullptr;
}
Library::~Library() {
    HistoryNode* current = historyHead;
    while (current != nullptr) {
        HistoryNode* nextNode = current->next;
        delete current;
        current = nextNode;
    }
}
void Library::addHistory(string message) {
    HistoryNode* newNode = new HistoryNode(message);
    if (historyHead == nullptr) {
        historyHead = newNode;
        return;
    }
    HistoryNode* temp = historyHead;
    while (temp->next != nullptr) {
        temp = temp->next;
    }
    temp->next = newNode;
}

void Library::viewHistory() const {
    if (historyHead == nullptr) {
        cout << "\nNo history available yet.\n";
        return;
    }

    cout << "\n--- LIBRARY TRANSACTION HISTORY ---\n";
    HistoryNode* temp = historyHead;
    int count = 1;
    while (temp != nullptr) {
        cout << count << ". " << temp->logMessage << endl;
        temp = temp->next;
        count++;
    }
    cout << "-----------------------------------\n";
}

void Library::issueBook() {
    int id;
    cout << "\nEnter Book ID to issue: ";
    cin >> id;

    for (int i = 0; i < books.size(); i++) {
        if (books[i].getId() == id) {
            if (books[i].getIsIssued()) {
                cout << "Sorry, this book is already issued to someone else!\n";
            } else {
                books[i].setIsIssued(true); // Book status update kiya
                cout << "Book '" << books[i].getTitle() << "' issued successfully!\n";
                addHistory("Issued Book: ID " + to_string(id) + " - " + books[i].getTitle());
            }
            return;
        }
    }
    cout << "Book with ID " << id << " not found!\n";
}

void Library::returnBook() {
    int id;
    cout << "\nEnter Book ID to return: ";
    cin >> id;

    for (int i = 0; i < books.size(); i++) {
        if (books[i].getId() == id) {
            if (!books[i].getIsIssued()) {
                cout << "This book is not issued yet!\n";
            } else {
                books[i].setIsIssued(false); // Book status wapas available kar diya
                cout << "Book '" << books[i].getTitle() << "' returned successfully!\n";
                addHistory("Returned Book: ID " + to_string(id) + " - " + books[i].getTitle());
            }
            return;
        }
    }
    cout << "Book with ID " << id << " not found!\n";
}
void Library::addBook() {
    int id;
    string title, author;
    cout << "\nEnter Book ID: ";
    cin >> id;
    cin.ignore();
    cout << "Enter Book Title: ";
    getline(cin, title);
    cout << "Enter Book Author: ";
    getline(cin, author);

    Book newBook(id, title, author);
    books.push_back(newBook);
    cout << "\nBook added successfully!\n";
    addHistory("Added New Book: ID " + to_string(id) + " - " + title);
}

void Library::viewAllBooks() const {
    if (books.empty()) {
        cout << "\nNo books available in the library.\n";
        return;
    }
    cout << "\n--- LIST OF BOOKS ---\n";
    for (const Book& book : books) {
        book.displayBook();
    }
    cout << "---------------------\n";
}
void Library::sortBooksById() {
    int n = books.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (books[j].getId() > books[j + 1].getId()) {
                // Swap manually
                Book temp = books[j];
                books[j] = books[j + 1];
                books[j + 1] = temp;
            }
        }
    }
    cout << "(Books sorted by ID automatically for Binary Search)\n";
}
void Library::linearSearch(int id) const {
    for (int i = 0; i < books.size(); i++) {
        if (books[i].getId() == id) {
            cout << "\nBook Found (using Linear Search)!\n";
            books[i].displayBook();
            return;
        }
    }
    cout << "\nBook with ID " << id << " not found!\n";
}
void Library::binarySearch(int id) const {
    int left = 0;
    int right = books.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (books[mid].getId() == id) {
            cout << "\nBook Found (using Binary Search)!\n";
            books[mid].displayBook();
            return;
        }
        
        if (books[mid].getId() < id) {
            left = mid + 1;
        } else {
            right = mid - 1; 
        }
    }
    cout << "\nBook with ID " << id << " not found!\n";
}
void Library::searchBook() {
    if (books.empty()) {
        cout << "\nLibrary is empty! Add books first.\n";
        return;
    }

    int searchId;
    cout << "\nEnter Book ID to search: ";
    cin >> searchId;

    int choice;
    cout << "Choose Search Algorithm:\n";
    cout << "1. Linear Search (Works on Unsorted Data)\n";
    cout << "2. Binary Search (Requires Sorted Data)\n";
    cout << "Enter choice: ";
    cin >> choice;

    if (choice == 1) {
        linearSearch(searchId);
    } else if (choice == 2) {
        sortBooksById();
        binarySearch(searchId);
    } else {
        cout << "Invalid choice!\n";
    }
}