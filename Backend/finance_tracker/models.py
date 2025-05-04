from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['name', 'user']
        ordering = ['name']

    def __str__(self):
        return self.name

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='transactions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Recurring transaction fields
    is_recurring = models.BooleanField(default=False)
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES, null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    last_processed = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.transaction_type}: {self.amount} - {self.description}"
