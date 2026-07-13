param(
    [string]$ApiBase = "http://localhost:5248/api/questions",
    [int]$PerformanceTarget = 100,
    [int]$MaxLocalResponseMs = 500,
    [switch]$SkipPerformanceSeed
)

$ErrorActionPreference = "Stop"

$results = New-Object System.Collections.Generic.List[object]

function Add-Result {
    param(
        [string]$Name,
        [string]$Expected,
        [string]$Actual,
        [bool]$Passed
    )

    $results.Add([pscustomobject]@{
        Test = $Name
        Expected = $Expected
        Actual = $Actual
        Passed = $Passed
    })
}

function Assert-Equal {
    param(
        [object]$Actual,
        [object]$Expected,
        [string]$Message
    )

    if ($Actual -ne $Expected) {
        throw "$Message Expected '$Expected', got '$Actual'."
    }
}

function Invoke-QuestionApi {
    param(
        [string]$Method,
        [string]$Path = "",
        [object]$Body = $null
    )

    $uri = "$ApiBase$Path"
    $json = $null
    if ($null -ne $Body) {
        $json = $Body | ConvertTo-Json -Depth 8
    }

    try {
        if ($null -ne $json) {
            $response = Invoke-WebRequest -Uri $uri -Method $Method -ContentType "application/json; charset=utf-8" -Body $json -UseBasicParsing
        } else {
            $response = Invoke-WebRequest -Uri $uri -Method $Method -UseBasicParsing
        }

        $content = $null
        if (-not [string]::IsNullOrWhiteSpace($response.Content)) {
            $content = $response.Content | ConvertFrom-Json
        }

        return [pscustomobject]@{
            StatusCode = [int]$response.StatusCode
            Headers = $response.Headers
            Body = $content
            RawBody = $response.Content
        }
    } catch {
        if ($_.Exception.Response) {
            return [pscustomobject]@{
                StatusCode = [int]$_.Exception.Response.StatusCode
                Headers = $_.Exception.Response.Headers
                Body = $null
                RawBody = ""
            }
        }

        throw
    }
}

function ConvertFrom-CodePoint {
    param([int[]]$CodePoints)

    return -join ($CodePoints | ForEach-Object { [char]$_ })
}

function New-ArabicQuestion {
    param([string]$Suffix = "")

    $questionText = ConvertFrom-CodePoint @(0x0645, 0x0627, 0x0020, 0x0645, 0x0639, 0x0646, 0x0649, 0x0020, 0x0643, 0x0644, 0x0645, 0x0629, 0x0020, 0x0643, 0x062A, 0x0627, 0x0628, 0x061F)
    $optionA = ConvertFrom-CodePoint @(0x0642, 0x0644, 0x0645)
    $optionB = ConvertFrom-CodePoint @(0x0643, 0x062A, 0x0627, 0x0628)
    $optionC = ConvertFrom-CodePoint @(0x0645, 0x062F, 0x0631, 0x0633, 0x0629)
    $optionD = ConvertFrom-CodePoint @(0x0628, 0x064A, 0x062A)
    $explanation = "$optionB = kitap"

    return [ordered]@{
        questionText = "$questionText $Suffix"
        optionA = $optionA
        optionB = $optionB
        optionC = $optionC
        optionD = $optionD
        optionE = $null
        correctOption = "B"
        explanation = "$explanation $Suffix"
    }
}

function Run-Test {
    param(
        [string]$Name,
        [string]$Expected,
        [scriptblock]$Script
    )

    try {
        $actual = & $Script
        Add-Result -Name $Name -Expected $Expected -Actual $actual -Passed $true
    } catch {
        Add-Result -Name $Name -Expected $Expected -Actual $_.Exception.Message -Passed $false
    }
}

$createdId = $null

Run-Test "T1 GET /api/questions" "200 and array body" {
    $response = Invoke-QuestionApi -Method "GET"
    Assert-Equal $response.StatusCode 200 "GET /api/questions failed."
    if ($null -eq $response.Body.Count -and $response.RawBody -ne "[]") {
        throw "Response body is not an array."
    }
    "HTTP 200, array response"
}

Run-Test "T2 POST /api/questions" "201 and Location header" {
    $response = Invoke-QuestionApi -Method "POST" -Body (New-ArabicQuestion "crud")
    Assert-Equal $response.StatusCode 201 "POST /api/questions failed."
    if ($null -eq $response.Body.id) {
        throw "Created response does not include id."
    }
    $script:createdId = $response.Body.id
    "HTTP 201, id=$script:createdId"
}

Run-Test "T3 POST /api/questions missing questionText" "400 Bad Request" {
    $invalid = New-ArabicQuestion "invalid"
    $invalid.Remove("questionText")
    $response = Invoke-QuestionApi -Method "POST" -Body $invalid
    Assert-Equal $response.StatusCode 400 "Invalid POST should fail."
    "HTTP 400"
}

Run-Test "T4 GET /api/questions/{id}" "200 and created question" {
    $response = Invoke-QuestionApi -Method "GET" -Path "/$script:createdId"
    Assert-Equal $response.StatusCode 200 "GET by id failed."
    Assert-Equal $response.Body.id $script:createdId "GET by id returned different id."
    "HTTP 200, id=$($response.Body.id)"
}

Run-Test "T5 GET /api/questions/99999999" "404 Not Found" {
    $response = Invoke-QuestionApi -Method "GET" -Path "/99999999"
    Assert-Equal $response.StatusCode 404 "Missing GET should return 404."
    "HTTP 404"
}

Run-Test "T6 PUT /api/questions/{id}" "204 No Content and persisted update" {
    $updated = New-ArabicQuestion "updated"
    $updated["id"] = $script:createdId
    $response = Invoke-QuestionApi -Method "PUT" -Path "/$script:createdId" -Body $updated
    Assert-Equal $response.StatusCode 204 "PUT failed."

    $check = Invoke-QuestionApi -Method "GET" -Path "/$script:createdId"
    Assert-Equal $check.Body.questionText $updated["questionText"] "PUT update was not persisted."
    "HTTP 204, update persisted"
}

Run-Test "T7 DELETE /api/questions/{id}" "204 No Content" {
    $response = Invoke-QuestionApi -Method "DELETE" -Path "/$script:createdId"
    Assert-Equal $response.StatusCode 204 "DELETE failed."
    "HTTP 204"
}

Run-Test "T8 DELETE deleted id" "404 Not Found" {
    $response = Invoke-QuestionApi -Method "DELETE" -Path "/$script:createdId"
    Assert-Equal $response.StatusCode 404 "Deleting already deleted id should return 404."
    "HTTP 404"
}

Run-Test "Round-trip Arabic text" "POST then GET returns exact text" {
    $text = ConvertFrom-CodePoint @(0x0629, 0x0020, 0x0649, 0x0020, 0x0624, 0x0020, 0x0626, 0x0020, 0x066B, 0x0020, 0x0643, 0x064E, 0x062A, 0x064E, 0x0628, 0x064E)
    $payload = New-ArabicQuestion "roundtrip"
    $payload["questionText"] = $text
    $created = Invoke-QuestionApi -Method "POST" -Body $payload
    Assert-Equal $created.StatusCode 201 "Round-trip POST failed."

    $fetched = Invoke-QuestionApi -Method "GET" -Path "/$($created.Body.id)"
    Assert-Equal $fetched.Body.questionText $text "Arabic round-trip text changed."

    $delete = Invoke-QuestionApi -Method "DELETE" -Path "/$($created.Body.id)"
    Assert-Equal $delete.StatusCode 204 "Round-trip cleanup failed."
    "Exact match, length=$($text.Length)"
}

Run-Test "Invalid correctOption" "400 Bad Request" {
    $invalid = New-ArabicQuestion "bad-option"
    $invalid["correctOption"] = "Z"
    $response = Invoke-QuestionApi -Method "POST" -Body $invalid
    Assert-Equal $response.StatusCode 400 "Invalid correctOption should fail."
    "HTTP 400"
}

Run-Test "Performance GET /api/questions" "HTTP 200 under threshold after target seed" {
    if (-not $SkipPerformanceSeed) {
        $initial = Invoke-QuestionApi -Method "GET"
        $count = @($initial.Body).Count
        for ($i = $count; $i -lt $PerformanceTarget; $i++) {
            $seedResponse = Invoke-QuestionApi -Method "POST" -Body (New-ArabicQuestion "perf-$i")
            Assert-Equal $seedResponse.StatusCode 201 "Performance seed insert failed."
        }
    }

    $watch = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-QuestionApi -Method "GET"
    $watch.Stop()

    Assert-Equal $response.StatusCode 200 "Performance GET failed."
    if ($watch.ElapsedMilliseconds -gt $MaxLocalResponseMs) {
        throw "GET took $($watch.ElapsedMilliseconds)ms, over $MaxLocalResponseMs ms."
    }

    "HTTP 200, count=$(@($response.Body).Count), elapsed=$($watch.ElapsedMilliseconds)ms"
}

$results | Format-Table -AutoSize

if ($results.Where({ -not $_.Passed }).Count -gt 0) {
    exit 1
}
