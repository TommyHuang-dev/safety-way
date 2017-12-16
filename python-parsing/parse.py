# parses the file for weapons and shield stats in "open_file"
def parse_file(open_file):
    cur_line = open_file.readline()

    # writes x on a line, then y on the naxt line
    for line in open_file:
        cur_line = line.split()
        if cur_line[0] == '"x"':
            newfile.write(cur_line[2][:-1] + "\n")
        elif cur_line[0] == '"y"':
            newfile.write(cur_line[2] + "\n")


# get the entire file and read it
file = open("../ROBBdata.json", "r")
newfile = open("../parsed-data/robb", "w")
parse_file(file)


