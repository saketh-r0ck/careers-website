def smallest_palindromic_subsequence(s):
    if s=='':
        return -1
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 1
    for cl in range(2, n+1):
        for i in range(n-cl+1):
            j = i + cl - 1
            if s[i] == s[j] and cl == 2:
                dp[i][j] = 2
            elif s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                dp[i][j] = max(dp[i][j-1], dp[i+1][j])
    subsequence = ''
    i, j = 0, n-1
    while i < j:
        if s[i] == s[j]:
            subsequence += s[i]
            i += 1
            j -= 1
        elif dp[i][j-1] > dp[i+1][j]:
            j -= 1
        else:
            i += 1
    
    if i == j:
        subsequence += s[i]
    
    return subsequence

s = input()
print(smallest_palindromic_subsequence(s))

