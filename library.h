#ifndef LIBRARY_H
#define LIBRARY_H

#include "Book.h"
#include <vector>
#include <string>

struct HistoryNode {
    string logMessage;
    HistoryNode* next;
    HistoryNode(string msg) {
        logMessage = msg;
        next = nullptr;
    }
};

class Library {
private:
    vector<Book> books;
    HistoryNode* historyHead;
    void sortBooksById(); 

    void linearSearch(int id) const;
    void binarySearch(int id) const;
    void addHistory(string message); 

public:
    Library();
    ~Library(); 

    void addBook();
    void viewAllBooks() const;
    void searchBook(); 

    // Naye Features
    void issueBook();
    void returnBook();
    void viewHistory() const;
};

#endif