def is_prime(n):
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

def is_pythagorean_prime(num):
    if num <= 1:
        return False
    return is_prime(num) and (num - 1) % 4 == 0

t=int(input())

for i in range(t):
    n=int(input())
    if is_pythagorean_prime(n):
        print("YES")
    else:
        print("NO")