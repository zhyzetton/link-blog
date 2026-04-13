# 算法基础

## 排序算法

### 快速排序

快速排序是基于分治法的经典高效排序算法，核心思路是 “选基准、分区间、递归排”。

1. 选基准：从数组中选取一个元素作为基准值（pivot），常用首尾、中间或随机元素。
2. 分区：遍历数组，将小于基准的元素放左侧，大于基准的放右侧，基准最终落在有序位置。
3. 递归：对左右两个子数组重复上述步骤，直到子数组长度≤1，整体完成排序。

**关键特性**
1. 时间复杂度：平均 O(nlogn)，最坏 O(n²)（如有序数组选首尾为基准）
2. 空间复杂度：O(logn)（递归调用栈）
3. 排序性质：不稳定排序，原址排序，实际工程中效率极高

代码：
```java
public void quickSort(int[] arr, int left, int right) {
    if (left > right) return;
    int pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);

}

public int partition(int[] arr, int left, int right) {
    int pivot = arr[left];
    int i = left, j = right;
    while (i < j) {
        while (i < j && arr[j] >= pivot) j--;
        while (i < j && arr[i] <= pivot) i++;
        if (i < j) {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    arr[left] = arr[i];
    arr[i] = pivot;
    return i;
}
```

### 归并排序

归并排序是基于**分治法**的稳定排序算法，核心是“先拆分、再合并”。

1. **分解**：将待排序数组从中间不断拆分为左右两个子数组，直到每个子数组只剩单个元素。
2. **合并**：逐层将两个有序子数组合并成一个更大的有序数组，最终得到完整有序序列。

**关键特性**
- 时间复杂度：最好、最坏、平均均为 **O(nlogn)**
- 空间复杂度：**O(n)**（需要额外辅助数组）
- 排序性质：**稳定排序**，不依赖数据分布，适合大数据量与外部排序

代码：
```java
public void mergeSort(int[] arr) {
    if (arr.length > 1) {
        int mid = arr.length / 2;
        int[] left = Arrays.copyOfRange(arr, 0, mid);
        int[] right = Arrays.copyOfRange(arr, mid, arr.length);
        mergeSort(left);
        mergeSort(right);

        merge(arr, left, right);
    }


}
public void merge(int[] arr, int[] left, int[] right) {
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            arr[k] = left[i];
            i++;
        } else {
            arr[k] = right[j];
            j++;
        }
        k++;
    }
    while (i < left.length) {
        arr[k] = left[i];
        i++;
        k++;
    }
    while (j < right.length) {
        arr[k] = right[j];
        j++;
        k++;
    }
}
```

## 搜索算法

### 二分查找

二分查找是一种在**有序数组**中高效查找目标值的算法，核心思路是不断缩小查找范围。

1. 前提：数组必须**有序**
2. 过程：每次取区间中间元素与目标比较
   - 中间值 = 目标：找到
   - 中间值 > 目标：在左半区间继续查找
   - 中间值 < 目标：在右半区间继续查找
3. 重复直到找到或区间为空

**关键特性**
- 时间复杂度：**O(log n)**
- 空间复杂度：**O(1)**（迭代实现）
- 仅适用于**有序、可随机访问**的结构

代码：
```java
public int binarySearch(int[] arr, int target) {
    if (arr == null || arr.length == 0) return -1;
    int left = 0, right = arr.length - 1;

    while (left <= right) {
        int mid = (left + right) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] > target) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return -1;
}
```

## 链表

### 反转链表

代码：
```java
public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
```
### 是否有环

代码：
```java
public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) return false;
    // 快慢指针
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next; // 快指针走两次
        if (slow == fast) {
            return true;
        }
    }
    return false;
}
```

## 二叉树

### DFS

深度优先搜索（Depth-First Search）是一种遍历树或图的算法，从根节点开始，每次选择一条路径，直到到达叶子节点或无法继续选择路径。

**关键特性**
- 时间复杂度：**O(n)**（n为节点数）
- 空间复杂度：**O(n)**（递归调用栈）
- 仅适用于**有向图**，避免无限循环

代码：
```java
public void dfs(TreeNode root) {
    if (root == null) return;
    // 先序遍历：根-左-右
    System.out.println(root.val);
    dfs(root.left);
    dfs(root.right);
}
```
求解最大深度：
```java
public int maxDepth(TreeNode root) {
    if (root == null) {
        return 0; // 到底了，深度为 0
    }
    int leftDepth = maxDepth(root.left);
    int rightDepth = maxDepth(root.right);
    return Math.max(leftDepth, rightDepth) + 1;
}
```
### BFS

广度优先搜索（Breadth-First Search）是一种遍历树或图的算法，从根节点开始，每次选择所有相邻节点，直到到达所有节点。

1. 前提：树或图必须**无环**
2. 过程：每次从队列头取出一个节点，将其标记为已访问，然后将其所有相邻节点加入队列
3. 重复直到队列为空或访问所有节点

**关键特性**
- 时间复杂度：**O(n)**（n为节点数）
- 空间复杂度：**O(n)**（队列）
- 仅适用于**无向图**，避免无限循环

二叉树的层序遍历：
```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root); // 根节点入队
    
    while (!queue.isEmpty()) {
        int size = queue.size(); // 当前层的节点个数
        List<Integer> levelList = new ArrayList<>();
        
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll(); // 出队
            levelList.add(node.val);
            
            // 左右孩子入队
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        res.add(levelList); // 把这一层的结果加入总结果集
    }
    return res;
}
```