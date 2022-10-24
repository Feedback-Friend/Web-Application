from utility import passwordStrength

def test1():
    password = "abcdefghi"
    length = 3
    assert passwordStrength(password, length) == 1


def test2():
    password = "ab"
    length = 3
    assert passwordStrength(password, length) == 0


def test3():
    password = "a!"
    length = 3
    assert passwordStrength(password, length) == 1


def test4():
    password = "ab!"
    length = 3
    assert passwordStrength(password, length) == 2


def test5():
    password = "abcd"
    length = 5
    assert passwordStrength(password, length) == 0


def test6():
    password = "abcde"
    length = 5
    assert passwordStrength(password, length) == 1


def test7():
    password = "abcd!"
    length = 5
    assert passwordStrength(password, length) == 2