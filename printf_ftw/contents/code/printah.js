function print_element_names(obj) {  
    for(var e in obj) {
        print(e + ":");
    }
}

l = new Label()
print_element_names(l);
print(l.alignment);
print(QtAlignRight);
